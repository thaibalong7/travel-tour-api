const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const validate_helper = require('../helper/validate');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const helper_add_link = require('../helper/add_full_link');
const link_img = require('../config/setting').link_img;
const { sendETicketEmail } = require('../helper/send_email');
const checkPolicy_helper = require('../helper/check_policy');
const send_mail_helper = require('../helper/send_email');
const cancel_policy = require('../config/setting').cancel_policy;
const socket = require('../socket');

var publicKEY = fs.readFileSync('./app/middleware/public.key', 'utf8');
var verifyOptions = {
    expiresIn: '30d',
    algorithm: "RS256"
}

const asyncMap = async (arr, cb) => {
    return arr.map(cb);
}

const asyncFor = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i);
    }
}

// Random number from 0 to length
const randomNumber = (length) => {
    return Math.floor(Math.random() * length)
}

const parseJSONListBookTour = async (book_tours, isRaw = false) => {
    for (let i = 0, l = book_tours.length; i < l; i++) {
        if (book_tours[i].cancel_bookings.length > 0) {
            if (isRaw) {
                book_tours[i].cancel_bookings[0].refund_message = JSON.parse(book_tours[i].cancel_bookings[0].refund_message);
                book_tours[i].cancel_bookings[0].request_offline_person = JSON.parse(book_tours[i].cancel_bookings[0].request_offline_person);
            }
            else {
                book_tours[i].cancel_bookings[0].dataValues.refund_message = JSON.parse(book_tours[i].cancel_bookings[0].dataValues.refund_message);
                book_tours[i].cancel_bookings[0].dataValues.request_offline_person = JSON.parse(book_tours[i].cancel_bookings[0].dataValues.request_offline_person);
            }
        }
        // if (_book_tour_history.status == 'paid')
        if (isRaw)
            book_tours[i].message_pay = JSON.parse(book_tours[i].message_pay);
        else
            book_tours[i].dataValues.message_pay = JSON.parse(book_tours[i].message_pay);
    }
}

// Generate Pseudo Random String, if safety is important use dedicated crypto/math library for less possible collisions!
const generateCode = async (length) => {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(randomNumber(possible.length));
    }
    return text;
}

const priority_status_booking = {
    "pending_cancel": 1,
    "booked": 2,
    "confirm_cancel": 3,
    "paid": 4,
    "finished": 5,
    "not_refunded": 6,
    "refunded": 7,
    "cancelled": 8,
}

const add_isNeedCall = (_book_tours, days_need_call) => {
    for (let i = 0, length = _book_tours.length; i < length; i++) {
        if (_book_tours[i].status === 'booked') {
            const cur_date = new Date();
            const timeDiff = new Date(_book_tours[i].tour_turn.start_date) - cur_date;
            const days_before_go = parseInt(timeDiff / (1000 * 60 * 60 * 24) + 1) //số ngày còn lại trc khi đi;

            // phải thanh toán trước _book_tours[i].tour_turn.payment_term ngày
            if (days_before_go > parseInt(_book_tours[i].tour_turn.payment_term) && days_before_go <= (parseInt(_book_tours[i].tour_turn.payment_term) + days_need_call)) {
                // const payment_term = new Date(_book_tours[i].tour_turn.start_date);
                // payment_term.setDate(payment_term.getDate() - parseInt(_book_tours[i].tour_turn.payment_term) - 1);
                // payment_term.setHours(23);
                // payment_term.setMinutes(59);
                // payment_term.setSeconds(59);
                // _book_tours[i].dataValues.payment_term = payment_term;
                // result.push(_book_tours[i]);

                _book_tours[i].dataValues.isNeedCall = true;
            }
            else {
                _book_tours[i].dataValues.isNeedCall = false;
            }
        }
        else {
            _book_tours[i].dataValues.isNeedCall = false;
        }
    }
}

const sortBookTour = (book_tour1, book_tour2) => {
    return priority_status_booking[book_tour1.status] - priority_status_booking[book_tour2.status];
}

const book_tour = async (req, res, _user = null) => {
    // {   //req.body
    //     idTour_Turn,
    //     payment,
    //     fullname,
    //     phone,
    //     email,
    //     address,
    //     passengers, //list các hành khách //ít nhất 1 người
    //     total_pay
    // }

    // {   //passergers[i]
    //     fullname,
    //     phone, //not require
    //     birthdate,
    //     sex,
    //     type //
    // }

    try {
        //check req.body
        if (typeof req.body.fullname !== 'undefined' && typeof req.body.phone !== 'undefined' //những thuộc tính này là bắt buộc
            && typeof req.body.email !== 'undefined' && typeof req.body.address !== 'undefined'
            && typeof req.body.passengers !== 'undefined' && typeof req.body.total_pay !== 'undefined'
            && typeof req.body.idTour_Turn !== 'undefined' && typeof req.body.payment !== 'undefined'
            && typeof req.body.passport !== 'undefined') {
            const arr_sex = ['male', 'female', 'other'];
            const _types = await db.type_passenger.findAll();
            const arr_type = await asyncMap(_types, (type) => {
                return type.name;
            })
            const _payments = await db.payment_method.findAll();
            const arr_payment = await asyncMap(_payments, (payment) => {
                return payment.name;
            })
            if (arr_payment.indexOf(req.body.payment) === -1) { //payment không khớp với db
                return res.status(400).json({ msg: 'Wrong payment' });
            }
            if (isNaN(req.body.total_pay)) { //total pay không phải là số
                return res.status(400).json({ msg: 'Wrong total pay' });
            }
            else {
                if (parseInt(req.body.total_pay) < 0) //total pay nhỏ hơn 0, giá mà âm
                    return res.status(400).json({ msg: 'Wrong total pay' });
            }
            if (isNaN(req.body.idTour_Turn)) { //id tour turn mà đếch phải số
                return res.status(400).json({ msg: 'Wrong id tour turn' });
            }
            if (!Array.isArray(req.body.passengers)) //list passengers k phải là mảng
            {
                return res.status(400).json({ msg: 'Wrong list passenger' });
            }
            if (!await validate_helper.validateEmail(req.body.email)) { //email không hợp lệ
                return res.status(400).json({ msg: 'Wrong email' });
            }
            if (!await validate_helper.validatePhoneNumber(req.body.phone)) { //phone k hợp lệ
                return res.status(400).json({ msg: 'Wrong phone' });
            }
            if (!await validate_helper.check_list_passengers(req.body.passengers, arr_sex, arr_type)) { //list passenger k vượt qua được hàm test tính hợp lệ
                return res.status(400).json({ msg: 'Wrong list passenger' });
            }
            const _tour_turn = await db.tour_turns.findByPk(req.body.idTour_Turn);
            if (_tour_turn) {
                if (_tour_turn.status === 'private' || new Date(_tour_turn.start_date) <= new Date()) //tour turn là private hoặc đã đi rồi
                    return res.status(400).json({ msg: 'Wrong tour turn' });

                //check thêm có còn chỗ để book hay không
                if (parseInt(_tour_turn.num_current_people) + req.body.passengers.length > parseInt(_tour_turn.num_max_people))
                    return res.status(400).json({ msg: "This tour is full" });
            }
            else { //id tour turn truyền vào không có trong db
                return res.status(400).json({ msg: 'Wrong tour turn' });
            }
            //pass hết các kiểm tra hợp lệ
            if (req.body.payment === 'incash' || req.body.payment === 'transfer' || req.body.payment === 'online') { //thanh toán tiền mặt hoặc chuyển khoảng ngân hàng

                var new_contact_info = {
                    email: req.body.email,
                    fullname: req.body.fullname,
                    phone: req.body.phone,
                    address: req.body.address,
                    passport: req.body.passport
                }
                if (_user !== null) { //check có user hay k
                    new_contact_info.fk_user = _user.id
                }
                //tạo contact info trước
                db.book_tour_contact_info.create(new_contact_info).then(async (_contact_info) => {
                    //tạo xong và có id
                    let payment = _payments.find(p => p.name === req.body.payment);
                    //lấy id của contact info tạo book tour

                    let code_ticket = await generateCode(8);

                    let check_code_ticket = await db.book_tour_history.findAll({ where: { code: code_ticket } })

                    while (!check_code_ticket) {
                        code_ticket = await generateCode(8);
                        check_code_ticket = await db.book_tour_history.findAll({ where: { code: code_ticket } })
                    }

                    const new_book_tour = {
                        book_time: new Date(),
                        num_passenger: req.body.passengers.length,
                        total_pay: req.body.total_pay,
                        fk_contact_info: _contact_info.id,
                        fk_tour_turn: req.body.idTour_Turn,
                        fk_payment: payment.id,
                        code: code_ticket
                    };

                    if (req.body.payment === 'online') {
                        new_book_tour.status = 'paid' //thanh toán online thì status là đã thanh toán rồi
                    }

                    db.book_tour_history.create(new_book_tour).then(async _book_tour => {
                        //tạo xong lấy id tạo passenger
                        await asyncFor(req.body.passengers, async (passenger) => {
                            let type = _types.find(t => t.name === passenger.type)
                            var new_passenger = {
                                fullname: passenger.fullname,
                                birthdate: passenger.birthdate,
                                sex: passenger.sex,
                                fk_book_tour: _book_tour.id,
                                fk_type_passenger: type.id
                            }
                            if (passenger.phone) //k bắt buộc
                                new_passenger.phone = passenger.phone
                            if (passenger.passport) //k bắt buộc
                                new_passenger.passport = passenger.passport
                            await db.passengers.create(new_passenger);
                        })
                        //tạo passenger xong
                        //cập nhật num_current_people ở tour_turn
                        let num_current_people = _tour_turn.num_current_people;
                        num_current_people += req.body.passengers.length;
                        _tour_turn.num_current_people = num_current_people;
                        await _tour_turn.save();

                        //xong //trả response cho client
                        res.status(200).json({
                            msg: 'Book tour successful',
                            book_tour: _book_tour,
                            contact_info: _contact_info
                        });
                        const query = {
                            where: {
                                id: _book_tour.id
                            },
                            include: [{
                                model: db.book_tour_contact_info
                            },
                            {
                                model: db.payment_method
                            },
                            {
                                attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                                model: db.passengers,
                                include: [{
                                    model: db.type_passenger
                                }]
                            },
                            {
                                model: db.tour_turns,
                                include: [{
                                    model: db.tours,
                                    include: [{
                                        model: db.routes,
                                        include: [{
                                            model: db.locations
                                        }]
                                    }]
                                }]
                            }],
                            attributes: { exclude: [] },
                        }
                        const book_tour_for_send_email = await db.book_tour_history.findOne(query);
                        /* Gởi email nếu là đã thanh toán */
                        if (req.body.payment === 'online') {
                            sendETicketEmail(req, res, book_tour_for_send_email); //đặt tour thành công đã thanh toán
                            socket.notiBookingChange_BookNewTourPayOnline(book_tour_for_send_email);
                        }
                        else {
                            socket.notiBookingChange_BookNewTour(book_tour_for_send_email); //đặt tour thành công mà chưa thanh toán
                        }
                    })

                })
            }
            else {
                //phương thức thanh toán khác ngoài incash
                return res.status(400).json({ msg: 'This payment method has not been applied' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' });
        }
    }
    catch (err) {
        // console.log(err);
        return res.status(400).json({ msg: err.toString() });
    }
}

exports.book_tour = async (req, res) => {
    try {
        //book new tour
        if (req.headers.authorization !== 'undefined') {
            const token = req.headers.authorization;
            var decode;
            try {
                decode = jwt.verify(token, publicKEY, verifyOptions);
            } catch (err) {
                throw new Error('Auth failed')
            }
            const check_token = await db.blacklist_tokens.findOne({ where: { token: token } })
            if (!check_token) {
                const _user = await db.users.findByPk(decode.id);
                if (!_user) {
                    throw new Error('Auth failed')
                }
                else {
                    //thỏa điều kiện có user
                    book_tour(req, res, _user);
                }
            }
            else {
                throw new Error('Auth failed')
            }
        }
        else {
            //k có user
            book_tour(req, res);
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}

const addPriceOfListPricePassengers = async (_price_passengers, price) => {
    return _price_passengers.map(price_passenger => {
        var new_obj = {};
        new_obj.type = price_passenger.type_passenger.name;
        new_obj.percent = price_passenger.percent;
        new_obj.price = parseFloat(parseInt(price_passenger.percent) / 100) * parseInt(price)
        // new_obj.price = new_obj.price - parseInt(new_obj.price * discount);
        return new_obj
    })
}

const addPricePassengerOfListBookTour = async (_book_tour) => {
    for (let i = 0; i < _book_tour.length; i++) {
        _book_tour[i].tour_turn.discount = parseFloat(_book_tour[i].tour_turn.discount / 100);
        const list_price = await addPriceOfListPricePassengers(_book_tour[i].tour_turn.price_passengers, _book_tour[i].tour_turn.end_price);
        _book_tour[i].tour_turn.price_passengers = list_price;
    }
}

exports.getHistoryBookTourByUser = (req, res) => {
    try {
        const _user = req.userData;
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            const query = {
                include: [{
                    model: db.book_tour_contact_info,
                    where: {
                        fk_user: _user.id
                    }
                },
                {
                    model: db.cancel_booking
                },
                {
                    model: db.payment_method
                },
                {
                    model: db.tour_turns,
                    attributes: {
                        exclude: ['fk_tour'],
                        include: [
                            [Sequelize.literal('DATEDIFF(end_date, start_date) + 1'), 'lasting'],
                            [Sequelize.literal('CAST(price - (discount * price) / 100 AS UNSIGNED)'), 'end_price'],
                            [Sequelize.literal('price'), 'original_price'],
                        ]
                    },
                    include: [{
                        attributes: { exclude: ['detail'] },
                        model: db.tours
                    },
                    {
                        attributes: { exclude: ['fk_tourturn', 'fk_type_passenger'] },
                        model: db.price_passenger,
                        include: [{
                            model: db.type_passenger
                        }]
                    }]
                }],
                order: [['book_time', 'DESC']],
                attributes: { exclude: ['fk_contact_info'] },
                limit: per_page,
                offset: (page - 1) * per_page
            }
            db.book_tour_history.findAndCountAll(query).then(async _book_tour_history => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_book_tour_history.rows.length) + (next_page - 2) * per_page) === parseInt(_book_tour_history.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_book_tour_history.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_book_tour_history.rows.length) === 0)
                    next_page = -1;
                const result = _book_tour_history.rows.map((node) => node.get({ plain: true }));
                await checkPolicy_helper.add_is_cancel_booking(result);
                await addPricePassengerOfListBookTour(result);
                await helper_add_link.addLinkToursFeaturedImgOfListBookTour(result, req.headers.host);
                await parseJSONListBookTour(result, true);
                return res.status(200).json({
                    itemCount: _book_tour_history.count, //số lượng record được trả về
                    data: result,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}

exports.getHistoryBookTourById = (req, res) => {
    try {
        const idBook_tour = req.params.id;
        var is_info_tour = (req.query.tour == 'true');
        if (!isNaN(idBook_tour)) {
            var query = {
                attributes: { exclude: ['fk_contact_info', 'fk_payment'] },
                where: {
                    id: idBook_tour
                },
                include: [{
                    model: db.book_tour_contact_info
                },
                // {
                //     attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                //     model: db.passengers,
                //     include: [{
                //         model: db.type_passenger
                //     }]
                // },
                {
                    model: db.payment_method
                },
                {
                    attributes: { exclude: ['fk_book_tour'] },
                    model: db.cancel_booking
                }]
            }
            db.book_tour_history.findOne(query).then(async _book_tour_history => {
                if (_book_tour_history) {
                    _book_tour_history = _book_tour_history.dataValues;
                    const tour_turn = await db.tour_turns.findOne({
                        where: {
                            id: _book_tour_history.fk_tour_turn
                        },
                        attributes: { exclude: ['fk_tour'] },
                        include: [{
                            attributes: { exclude: ['detail'] },
                            model: db.tours
                        }]
                    })
                    const _types = await db.type_passenger.findAll({
                        include: [{
                            attributes: { exclude: ['fk_tour_turn'] },
                            model: db.price_passenger,
                            where: {
                                fk_tourturn: _book_tour_history.fk_tour_turn
                            }
                        }]
                    });
                    const type_passenger_detail = [];
                    await asyncFor(_types, async (type, i) => {
                        const list_passenger = await db.passengers.findAll({ //get num of type passenger
                            where: {
                                fk_book_tour: idBook_tour,
                                fk_type_passenger: type.id
                            }
                        })
                        var price_of_type = parseFloat(parseInt(type.price_passengers[0].percent) / 100) * parseInt(tour_turn.price)
                        price_of_type = price_of_type - parseInt(price_of_type * parseFloat(tour_turn.discount / 100))
                        type_passenger_detail[i] = {
                            type: type.name,
                            num_passenger: list_passenger.length,
                            price: price_of_type
                        }
                    })
                    tour_turn.discount = parseFloat(tour_turn.discount / 100);
                    if (is_info_tour) { //nếu lấy thêm thông tin tour turn nữa
                        if (tour_turn.tour.featured_img !== null) {
                            if (process.env.NODE_ENV === 'development')
                                tour_turn.tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + tour_turn.tour.featured_img
                            else
                                tour_turn.tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + tour_turn.tour.featured_img
                        }
                        _book_tour_history.tour_turn = tour_turn;
                        _book_tour_history.isCancelBooking = await checkPolicy_helper.check_policy_cancel_booking(_book_tour_history);
                    }
                    _book_tour_history.type_passenger_detail = type_passenger_detail;
                    return res.status(200).json({
                        data: _book_tour_history
                    })
                }
                else {
                    return res.status(400).json({ msg: 'Wrong id' })
                }
            })

        }
        else {
            return res.status(400).json({ msg: 'Wrong id' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}


exports.getPassengerInBookTourHistory = (req, res) => {
    try {
        const idBook_tour = req.params.id;
        // const page_default = 1;
        // const per_page_default = 10;
        // var page, per_page;
        // if (typeof req.query.page === 'undefined') page = page_default;
        // else page = req.query.page
        // if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        // else per_page = req.query.per_page
        // if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
        //     return res.status(400).json({ msg: 'Params is invalid' })
        // }
        // else {
        if (!isNaN(idBook_tour)) {
            // page = parseInt(page);
            // per_page = parseInt(per_page);
            var query = {
                attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                where: {
                    fk_book_tour: idBook_tour
                },
                include: [{
                    model: db.type_passenger
                }],
                // limit: per_page,
                // offset: (page - 1) * per_page
            }
            db.passengers.findAll(query).then(_passengers => {
                return res.status(200).json({
                    data: _passengers,
                })
            })
            // db.passengers.findAndCountAll(query).then(_passengers => {
            //     var next_page = page + 1;
            //     //Kiểm tra còn dữ liệu không
            //     if ((parseInt(_passengers.rows.length) + (next_page - 2) * per_page) === parseInt(_passengers.count))
            //         next_page = -1;
            //     //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
            //     if ((parseInt(_passengers.rows.length) < per_page))
            //         next_page = -1;
            //     if (parseInt(_passengers.rows.length) === 0)
            //         next_page = -1;
            //     return res.status(200).json({
            //         itemCount: _passengers.count, //số lượng record được trả về
            //         data: _passengers.rows,
            //         next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
            //     })
            // })
        }
        else {
            return res.status(400).json({ msg: 'Wrong id' })
        }
        //}
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.getAllBookTourHistoryWithoutPagination = (req, res) => {
    try {
        const status = req.query.status;
        const default_days_need_call = 2;
        let days_need_call;
        if (typeof req.query.days_need_call === 'undefined') days_need_call = default_days_need_call;
        else days_need_call = req.query.days_need_call
        days_need_call = parseInt(days_need_call);
        const include_tour_turn = {
            attributes: { exclude: ['fk_tour'] },
            model: db.tour_turns,
            include: [{
                attributes: { exclude: ['detail'] },
                model: db.tours
            }]
        }
        const has_departed = { //đang đi
            start_date: {
                [Op.lte]: new Date(), // start_date <= cur_date
            },
            end_date: {
                [Op.gte]: new Date() //end_date >= cur_date
            }
        };
        const finished = { //đã đi
            end_date: {
                [Op.lt]: new Date() //end_date < cur_date
            }
        }
        const not_yet_started = { //chưa đi
            start_date: {
                [Op.gt]: new Date(), // start_date > cur_date
            }
        }
        // const not_finished = { // chưa đi và đang đi
        //     end_date: {
        //         [Op.gte]: new Date() //end_date >= cur_date
        //     }
        // }
        if (status === 'finished') //đã đi //đã kết thúc
            include_tour_turn.where = finished
        if (status === 'not_yet_started') //chưa đi //chưa khởi hành
            include_tour_turn.where = not_yet_started
        if (status === 'has_departed') //đang đi //đã khởi hành
            include_tour_turn.where = has_departed

        const query = {
            attributes: { exclude: ['fk_contact_info', 'fk_tour_turn', 'fk_payment'] },
            include: [{
                model: db.book_tour_contact_info,
            },
                include_tour_turn
                , {
                model: db.payment_method
            }]
        };
        db.book_tour_history.findAll(query).then(async (_book_tours) => {
            _book_tours.sort(sortBookTour);
            await add_isNeedCall(_book_tours, days_need_call);
            return res.status(200).json({ data: _book_tours })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.getHistoryBookTourByCode = (req, res) => {
    try {
        const code = req.params.code;
        const isAdmin = (req.query.isAdmin == 'true');
        var is_info_tour = (req.query.tour == 'true');
        var query = {
            where: {
                code: code
            },
            include: [{
                model: db.book_tour_contact_info
            },
            {
                model: db.payment_method
            },
            {
                attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                model: db.passengers,
                include: [{
                    model: db.type_passenger
                }]
            },
            {
                model: db.cancel_booking,
                attributes: { exclude: ['fk_book_tour'] },
                include: [{
                    model: db.admins,
                    attributes: ['name']
                }]
            },
            {
                model: db.admins,
                attributes: ['name']
            }],
            attributes: { exclude: [] },
        }
        db.book_tour_history.findOne(query).then(async _book_tour_history => {
            if (_book_tour_history) {
                const tour_turn = await db.tour_turns.findOne({
                    where: {
                        id: _book_tour_history.fk_tour_turn
                    },
                    attributes: { exclude: ['fk_tour'] },
                    include: [{
                        attributes: { exclude: ['detail'] },
                        model: db.tours
                    }]
                })
                const _types = await db.type_passenger.findAll({
                    include: [{
                        attributes: { exclude: ['fk_tour_turn'] },
                        model: db.price_passenger,
                        where: {
                            fk_tourturn: _book_tour_history.fk_tour_turn
                        }
                    }]
                });
                const type_passenger_detail = [];
                await asyncFor(_types, async (type, i) => {
                    const list_passenger = await db.passengers.findAll({ //get num of type passenger
                        where: {
                            fk_book_tour: _book_tour_history.id,
                            fk_type_passenger: type.id
                        }
                    })
                    var price_of_type = parseFloat(parseInt(type.price_passengers[0].percent) / 100) * parseInt(tour_turn.price)
                    price_of_type = price_of_type - parseInt(price_of_type * parseFloat(tour_turn.discount / 100))
                    type_passenger_detail[i] = {
                        name_vi: type.name_vi,
                        type: type.name,
                        num_passenger: list_passenger.length,
                        price: price_of_type
                    }
                })
                if (!isAdmin)
                    tour_turn.discount = parseFloat(tour_turn.discount / 100);
                if (is_info_tour) { //nếu lấy thêm thông tin tour turn nữa
                    if (tour_turn.tour.featured_img !== null) {
                        if (process.env.NODE_ENV === 'development')
                            tour_turn.tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + tour_turn.tour.featured_img
                        else
                            tour_turn.tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + tour_turn.tour.featured_img
                    }
                    _book_tour_history.dataValues.tour_turn = tour_turn
                }
                _book_tour_history.dataValues.type_passenger_detail = type_passenger_detail;

                //parse JSON

                if (_book_tour_history.cancel_bookings.length > 0) {
                    _book_tour_history.cancel_bookings[0].dataValues.refund_message = JSON.parse(_book_tour_history.cancel_bookings[0].dataValues.refund_message);
                    _book_tour_history.cancel_bookings[0].dataValues.request_offline_person = JSON.parse(_book_tour_history.cancel_bookings[0].dataValues.request_offline_person);
                }
                _book_tour_history.dataValues.message_pay = JSON.parse(_book_tour_history.message_pay);
                return res.status(200).json({
                    data: _book_tour_history
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id' })
            }
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}

exports.getAllBookTourHistoryGroupByTourTurn = async (req, res) => {
    try {
        const status = req.query.status;
        const query = {
            attributes: { exclude: ['fk_tour'], include: [] },
            include: [{
                attributes: { exclude: ['fk_tour_turn', 'fk_contact_info'] },
                model: db.book_tour_history,
                include: [{
                    model: db.book_tour_contact_info,
                }]
            },
            {
                attributes: ['name', 'id'],
                model: db.tours
            }
            ],
            order: [['start_date', 'DESC']]
        }
        const has_departed = { //đang đi
            start_date: {
                [Op.lte]: new Date(), // start_date <= cur_date
            },
            end_date: {
                [Op.gte]: new Date() //end_date >= cur_date
            }
        };
        const finished = { //đã đi
            end_date: {
                [Op.lt]: new Date() //end_date < cur_date
            }
        }
        const not_yet_started = { //chưa đi
            start_date: {
                [Op.gt]: new Date(), // start_date > cur_date
            }
        }
        if (status === 'finished') //đã đi //đã kết thúc
            query.where = finished
        if (status === 'not_yet_started') //chưa đi //chưa khởi hành
            query.where = not_yet_started
        if (status === 'has_departed') //đang đi //đã khởi hành
            query.where = has_departed
        db.tour_turns.findAll(query).then(async (_tour_turn) => {
            return res.status(200).json({ data: _tour_turn })
        })
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.getBookTourHistoryByTourTurn = async (req, res) => {
    try {
        const idTourTurn = req.params.id;
        if (isNaN(parseInt(idTourTurn))) {
            return res.status(400).json({ msg: 'Wrong id tour turn' });
        }
        else {
            const tour_turn = await db.tour_turns.findOne({
                attributes: { exclude: ['fk_tour'] },
                where: {
                    id: idTourTurn
                },
                include: [{
                    attributes: { exclude: ['detail'] },
                    model: db.tours
                }]
            });
            var query = {
                attributes: { exclude: ['fk_contact_info', 'fk_payment'] },
                where: {
                    fk_tour_turn: idTourTurn
                },
                include: [{
                    model: db.book_tour_contact_info
                },
                {
                    attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                    model: db.passengers,
                    include: [{
                        model: db.type_passenger
                    }]
                },
                {
                    model: db.payment_method
                }]
            }
            db.book_tour_history.findAll(query).then(async _book_tours => {
                _book_tours.sort(sortBookTour);
                return res.status(200).json({
                    data: {
                        tour_turn: tour_turn,
                        book_tour_history: _book_tours
                    }
                })
            })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.payBookTour = async (req, res) => {
    try {
        const code = req.body.code;
        const book_tour = await db.book_tour_history.findOne({
            where: {
                code: code
            }
        })
        if (book_tour) {
            if (book_tour.status === 'booked') { // book tour vừa book mới có thể chuyể thành paid
                book_tour.status = 'paid' //chuyển thành status đã thanh toán
                book_tour.fk_staff = req.userData.id;
                if (typeof req.body.message_pay !== 'undefined') {
                    if (req.body.message_pay !== null)
                        book_tour.message_pay = JSON.stringify(req.body.message_pay)
                    else return res.status(400).json({ msg: 'Message pay is null' });
                }
                else {
                    return res.status(400).json({ msg: 'Missing message pay' });
                }
                await book_tour.save();

                /* Gởi Email E-Ticket */
                const query = {
                    where: {
                        id: book_tour.id
                    },
                    include: [{
                        model: db.book_tour_contact_info
                    },
                    {
                        model: db.payment_method
                    },
                    {
                        attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                        model: db.passengers,
                        include: [{
                            model: db.type_passenger
                        }]
                    },
                    {
                        model: db.tour_turns,
                        include: [{
                            model: db.tours,
                            include: [{
                                model: db.routes,
                                include: [{
                                    model: db.locations
                                }]
                            }]
                        }]
                    }],
                    attributes: { exclude: [] },
                }
                const book_tour_for_send_email = await db.book_tour_history.findOne(query);
                sendETicketEmail(req, res, book_tour_for_send_email);
                socket.notiBookingChange_PayBookTour(book_tour_for_send_email);

                return res.status(200).json({
                    msg: 'Pay successful',
                    data: book_tour
                })
            }
            else {
                return res.status(400).json({ msg: 'Can not pay this book tour' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong code' });
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.unpayBookTour = async (req, res) => {
    try {
        const code = req.body.code;
        const book_tour = await db.book_tour_history.findOne({
            where: {
                code: code
            }
        })
        if (book_tour) {
            if (book_tour.status === 'paid' || book_tour.status === 'pending_cancel') {
                book_tour.status = 'booked' //chuyển thành status booked
                await book_tour.save();
                return res.status(200).json({
                    msg: 'Pay successful',
                    data: book_tour
                })
            }
            if (book_tour.status === 'booked') {
                return res.status(400).json({ msg: 'This booking is booked' });
            }
            if (book_tour.status === 'cancelled') {
                return res.status(400).json({ msg: 'This booking has been cancelled' });
            }
            if (book_tour.status === 'finished') {
                return res.status(400).json({ msg: 'This booking has been finished' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong code' });
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

//hủy chưa thanh toán cho admin
exports.cancelBookTourStatusBooked = async (req, res) => {
    //  request_message
    //  request_offline_person (cái này là object có chứa name, passport)
    try {
        const code = req.body.code;
        const book_tour = await db.book_tour_history.findOne({
            where: {
                code: code
            },
            include: [{
                model: db.tour_turns
            }, {
                model: db.book_tour_contact_info
            }]
        })
        if (typeof req.body.request_message !== 'undefined' && typeof req.body.request_offline_person !== 'undefined') {
            if (req.body.request_offline_person !== null) {
                if (book_tour) {
                    if (book_tour.status == 'booked') {
                        //hủy thẳng luôn
                        const new_request = {
                            fk_book_tour: book_tour.id,
                            confirm_time: new Date(),
                            request_message: req.body.request_message,
                            request_offline_person: JSON.stringify(req.body.request_offline_person)
                        }

                        book_tour.status = 'cancelled';
                        const tour_turn = book_tour.tour_turn
                        tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(book_tour.num_passenger);
                        await book_tour.save();
                        await tour_turn.save();
                        //add new record
                        await db.cancel_booking.create(new_request).then(async _request => {
                            res.status(200).json({
                                data: {
                                    book_tour: book_tour,
                                    cancel_booking: _request
                                }
                            });

                            /* Gởi Email E-Ticket */
                            const query = {
                                where: {
                                    id: book_tour.id
                                },
                                include: [{
                                    model: db.book_tour_contact_info
                                },
                                {
                                    model: db.payment_method
                                },
                                {
                                    attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                                    model: db.passengers,
                                    include: [{
                                        model: db.type_passenger
                                    }]
                                },
                                {
                                    model: db.tour_turns,
                                    include: [{
                                        model: db.tours,
                                        include: [{
                                            model: db.routes,
                                            include: [{
                                                model: db.locations
                                            }]
                                        }]
                                    }]
                                }],
                                attributes: { exclude: [] },
                            }
                            const book_tour_for_send_email = await db.book_tour_history.findOne(query);
                            socket.notiBookingChange_CancelBookTourStatusBooked(book_tour_for_send_email);
                        })

                    }
                    else return res.status(400).json({ msg: "This book tour don't have status 'booked'" });
                }
                else {
                    return res.status(400).json({ msg: 'Wrong code' });
                }
            }
            else {
                return res.status(400).json({ msg: 'Request Offline Person is null' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Missing params' });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

//api này đã được bỏ 
//confirm cancel booking offline, khi chưa có request và phải tạo mới request
exports.confirmCancelBookTourOffline = async (req, res) => {
    //api này cần được chỉnh sửa, phải thêm db cho bảng cancel_booking đầy đủ
    try {
        if (typeof req.body.refund_period !== 'undefined' && typeof req.body.money_refunded !== 'undefined'
            && typeof req.body.request_message !== 'undefined' && typeof req.body.request_offline_person !== 'undefined'
            && typeof req.body.refund_message !== 'undefined') {
            if (req.body.request_offline_person === null) return res.status(400).json({ msg: 'Request Offline Person is null' });
            const code = req.body.code;
            const book_tour = await db.book_tour_history.findOne({
                where: {
                    code: code
                },
                include: [{
                    model: db.tour_turns
                }]
            })
            if (book_tour) {
                if (book_tour.status === 'paid') { //paid thì mới có thể requesst được chớ pending_cancel thì dùng api khác
                    book_tour.status = 'confirm_cancel' //chuyển thành status confirm_cancel

                    const money_refunded = (req.body.money_refunded);
                    if (!isNaN(money_refunded) && parseInt(money_refunded) >= 0) {
                        const curDate = new Date();
                        const refund_period = new Date(req.body.refund_period + ' 00:00:00 GMT+07:00');
                        const timeDiff = refund_period - new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
                        const days_before_can_refund = parseInt(timeDiff / (1000 * 60 * 60 * 24)) //số ngày còn lại có thể lên nhận thanh toán;
                        if (days_before_can_refund > cancel_policy.time_receive_money_after_confirm) {
                            const new_cancel_booking = {
                                request_message: req.body.request_message,
                                fk_book_tour: book_tour.id,
                                request_offline_person: JSON.stringify(req.body.request_offline_person),
                                confirm_time: new Date(),
                                refund_period: req.body.refund_period,
                                money_refunded: parseInt(req.body.money_refunded),
                                refund_message: JSON.stringify(req.body.refund_message),
                            }

                            db.cancel_booking.create(new_cancel_booking).then(async _cancel_booking => {
                                //update số lượng người đi ở tour turn nữa ...
                                const tour_turn = book_tour.tour_turn
                                tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(book_tour.num_passenger);
                                await book_tour.save();
                                await tour_turn.save();
                                res.status(200).json({
                                    msg: 'Confirm cancel successful',
                                    data: {
                                        book_tour: book_tour,
                                        cancel_booking: _cancel_booking
                                    }
                                })

                                //gởi mail confirm
                                const cancel_booking = await db.cancel_booking.findOne({
                                    where: {
                                        id: _cancel_booking.id
                                    },
                                    include: [{
                                        model: db.book_tour_history,
                                        include: [{
                                            model: db.book_tour_contact_info
                                        },
                                        {
                                            model: db.payment_method
                                        },
                                        {
                                            attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                                            model: db.passengers,
                                            include: [{
                                                model: db.type_passenger
                                            }]
                                        },
                                        {
                                            model: db.tour_turns,
                                            include: [{
                                                model: db.tours,
                                                include: [{
                                                    model: db.routes,
                                                    include: [{
                                                        model: db.locations
                                                    }]
                                                }]
                                            }]
                                        }],
                                    }]
                                })
                                send_mail_helper.sendConfirmCancelEmail(req, cancel_booking)

                                return;

                            });
                        }
                        else {
                            return res.status(400).json({ msg: 'Wrong refund period' })
                        }
                    }
                    else return res.status(400).json({ msg: 'Wrong money to refunded' })
                }
                else {
                    return res.status(400).json({ msg: "This book tour don't have status 'paid'" });
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong code' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' });
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

//cancel trực tiếp tại cty, nhận tiền hoàn lại ngay lập tức
exports.CancelBookTourOffline = async (req, res) => {
    try {
        if (typeof req.body.money_refunded !== 'undefined'
            && typeof req.body.request_message !== 'undefined' && typeof req.body.request_offline_person !== 'undefined') {
            if (req.body.request_offline_person === null) return res.status(400).json({ msg: 'Request Offline Person is null' });
            const code = req.body.code;
            const book_tour = await db.book_tour_history.findOne({
                where: {
                    code: code
                },
                include: [{
                    model: db.tour_turns
                }]
            })
            if (book_tour) {
                if (book_tour.status === 'paid') { //paid thì mới có thể requesst được chớ pending_cancel thì dùng api khác
                    book_tour.status = 'refunded' //chuyển thành status refunded

                    const money_refunded = (req.body.money_refunded);
                    if (!isNaN(money_refunded) && parseInt(money_refunded) >= 0) {
                        const curDate = new Date();

                        const new_cancel_booking = {
                            request_message: req.body.request_message,
                            fk_book_tour: book_tour.id,
                            request_offline_person: JSON.stringify(req.body.request_offline_person),
                            confirm_time: curDate,
                            money_refunded: parseInt(req.body.money_refunded),
                            refunded_time: curDate,
                            refund_message: JSON.stringify(req.body.request_offline_person),
                            fk_staff: req.userData.id
                        }

                        db.cancel_booking.create(new_cancel_booking).then(async _cancel_booking => {
                            //update số lượng người đi ở tour turn nữa ...
                            const tour_turn = book_tour.tour_turn
                            tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(book_tour.num_passenger);
                            await book_tour.save();
                            await tour_turn.save();
                            res.status(200).json({
                                msg: 'Confirm cancel successful',
                                data: {
                                    book_tour: book_tour,
                                    cancel_booking: _cancel_booking
                                }
                            })

                            //gởi mail refund
                            const cancel_booking = await db.cancel_booking.findOne({
                                where: {
                                    id: _cancel_booking.id
                                },
                                include: [{
                                    model: db.book_tour_history,
                                    include: [{
                                        model: db.book_tour_contact_info
                                    },
                                    {
                                        model: db.payment_method
                                    },
                                    {
                                        attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                                        model: db.passengers,
                                        include: [{
                                            model: db.type_passenger
                                        }]
                                    },
                                    {
                                        model: db.tour_turns,
                                        include: [{
                                            model: db.tours,
                                            include: [{
                                                model: db.routes,
                                                include: [{
                                                    model: db.locations
                                                }]
                                            }]
                                        }]
                                    }],
                                }]
                            })
                            send_mail_helper.sendRefundedEmail(req, cancel_booking);
                            socket.notiBookingChange_CancelBookTourOffline(cancel_booking);
                            return;

                        });
                    }
                    else return res.status(400).json({ msg: 'Wrong money to refunded' })
                }
                else {
                    return res.status(400).json({ msg: "This book tour don't have status 'paid'" });
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong code' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' });
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

//cancel offline nhưng số tiền hoàn trả là 0
exports.cancelBookTourWithNoMoneyRefund = async (req, res) => {
    try {
        if (typeof req.body.code !== 'undefined' && typeof req.body.request_message !== 'undefined'
            && typeof req.body.request_offline_person !== 'undefined') {
            const book_tour = await db.book_tour_history.findOne({
                where: {
                    code: req.body.code
                },
                include: [{
                    model: db.tour_turns
                }]
            })
            if (book_tour) {
                if (book_tour.status == 'paid') {
                    const new_request_cancel = {
                        fk_book_tour: book_tour.id,
                        request_message: req.body.request_message,
                        request_offline_person: JSON.stringify(req.body.request_offline_person),
                        confirm_time: new Date(),
                        fk_staff: req.userData.id
                    }
                    db.cancel_booking.create(new_request_cancel).then(async _cancel_booking => {
                        book_tour.status = 'refunded';
                        book_tour.save();

                        //update số lượng người đi ở tour turn nữa ...
                        const tour_turn = book_tour.tour_turn
                        tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(book_tour.num_passenger);
                        tour_turn.save();

                        res.status(200).json({
                            msg: 'Cancel book tour successful',
                            data: {
                                book_tour: book_tour,
                                cancel_booking: _cancel_booking
                            }
                        })

                        //gởi mail nữa
                        const cancel_booking = await db.cancel_booking.findOne({
                            where: {
                                id: _cancel_booking.id
                            },
                            include: [{
                                model: db.book_tour_history,
                                include: [{
                                    model: db.book_tour_contact_info
                                },
                                {
                                    model: db.payment_method
                                },
                                {
                                    attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                                    model: db.passengers,
                                    include: [{
                                        model: db.type_passenger
                                    }]
                                },
                                {
                                    model: db.tour_turns,
                                    include: [{
                                        model: db.tours,
                                        include: [{
                                            model: db.routes,
                                            include: [{
                                                model: db.locations
                                            }]
                                        }]
                                    }]
                                }],
                            }]
                        })
                        send_mail_helper.sendConfirmCancelWithNoMoneyEmail(req, cancel_booking)
                        socket.notiBookingChange_CancelBookTourOffline(cancel_booking);
                        return;
                    })
                }
                else {
                    return res.status(400).json({ msg: "This book tour don't have status 'paid'" });
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong code' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.updatePassenger = async (req, res) => {
    try {
        const idPassenger = req.body.id;
        const _passenger = await db.passengers.findByPk(idPassenger);
        if (_passenger) {
            const arr_sex = ['male', 'female', 'other'];
            if (typeof req.body.fullname !== 'undefined') {
                _passenger.fullname = req.body.fullname
            }
            if (typeof req.body.birthdate !== 'undefined') {
                _passenger.birthdate = req.body.birthdate
            }
            if (typeof req.body.sex !== 'undefined') {
                if (arr_sex.indexOf(req.body.sex) !== -1)
                    _passenger.sex = req.body.sex
            }
            if (typeof req.body.phone !== 'undefined') //k bắt buộc
                if (await validate_helper.validatePhoneNumber(req.body.phone))
                    _passenger.phone = req.body.phone
                else {
                    return res.status(400).json({ msg: 'Phone is invalid' });
                }
            if (typeof req.body.passport !== 'undefined') //k bắt buộc
                if (req.body.passport !== '')
                    _passenger.passport = req.body.passport
            if (typeof req.body.fk_type_passenger !== 'undefined') {
                if (parseInt(req.body.fk_type_passenger) !== parseInt(_passenger.fk_type_passenger)) {
                    const _book_tour = await db.book_tour_history.findOne({
                        where: {
                            id: _passenger.fk_book_tour
                        },
                        include: [{
                            model: db.tour_turns,
                        }]
                    })
                    const tour_turn = _book_tour.tour_turn;
                    const check_price_passenger = await db.price_passenger.findOne({
                        where: {
                            fk_tourturn: tour_turn.id,
                            fk_type_passenger: req.body.fk_type_passenger
                        }
                    })
                    if (check_price_passenger) {
                        const old_price_passenger = await db.price_passenger.findOne({
                            where: {
                                fk_tourturn: tour_turn.id,
                                fk_type_passenger: _passenger.fk_type_passenger
                            }
                        })

                        //tính old_price và new_price
                        const old_price = parseInt(old_price_passenger.percent / 100 * (tour_turn.price - tour_turn.price * tour_turn.discount / 100));
                        const new_price = parseInt(check_price_passenger.percent / 100 * (tour_turn.price - tour_turn.price * tour_turn.discount / 100));
                        //cập nhật lại giá toàn tour nếu có thay đổi
                        _book_tour.total_pay = _book_tour.total_pay + new_price - old_price;
                        _passenger.fk_type_passenger = req.body.fk_type_passenger;
                        await _book_tour.save();
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong id type passenger' });
                    }
                }
            }
            await _passenger.save();
            return res.status(200).json({
                msg: 'Update successful',
                data: _passenger
            })
        }
        else {
            return res.status(400).json({ msg: 'Wrong id passenger' });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}


exports.updateContactInfo = async (req, res) => {
    try {
        const idContactInfo = req.body.id;
        const _contact_info = await db.book_tour_contact_info.findByPk(idContactInfo);
        if (_contact_info) {
            if (typeof req.body.fullname !== 'undefined') {
                _contact_info.fullname = req.body.fullname
            }
            if (typeof req.body.phone !== 'undefined')
                if (await validate_helper.validatePhoneNumber(req.body.phone))
                    _contact_info.phone = req.body.phone
                else {
                    return res.status(400).json({ msg: 'Phone is invalid' });
                }
            if (typeof req.body.email !== 'undefined')
                if (await validate_helper.validateEmail(req.body.email))
                    _contact_info.email = req.body.email
                else {
                    return res.status(400).json({ msg: 'Email is invalid' });
                }
            if (typeof req.body.address !== 'undefined') {
                _contact_info.address = req.body.address
            }
            await _contact_info.save();
            return res.status(200).json({
                msg: 'Update successful',
                data: _contact_info
            })
        }
        else {
            return res.status(400).json({ msg: 'Wrong id contact_info' });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.deletePassenger = async (req, res) => {
    try {
        // do something to delete passengers
        const idPassenger = req.body.id;
        const _passenger = await db.passengers.findByPk(idPassenger);
        if (_passenger) {
            if (_passenger.fk_book_tour !== null) {
                const _book_tour = await db.book_tour_history.findOne({
                    where: {
                        id: _passenger.fk_book_tour
                    },
                    include: [{
                        model: db.tour_turns,
                    }]
                })
                const tour_turn = _book_tour.tour_turn;
                const price_passenger = await db.price_passenger.findOne({
                    where: {
                        fk_tourturn: tour_turn.id,
                        fk_type_passenger: _passenger.fk_type_passenger
                    }
                })

                //tính price của passenger đó
                const price = parseInt(price_passenger.percent / 100 * (tour_turn.price - tour_turn.price * tour_turn.discount / 100));

                _book_tour.total_pay = _book_tour.total_pay - price;
                _passenger.fk_book_tour = null;

                await _book_tour.save();
                await _passenger.save();

                return res.status(200).json({ msg: 'Delete passenger successful' });
            }
            else {
                return res.status(400).json({ msg: 'This passenger does not belong to any booking' });
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

const filterBookTourNeedCall = async (_book_tours, days_need_call) => {
    const result = [];
    for (let i = 0; i < _book_tours.length; i++) {
        if (_book_tours[i].status === 'booked') {
            const cur_date = new Date();
            const timeDiff = new Date(_book_tours[i].tour_turn.start_date) - cur_date;
            const days_before_go = parseInt(timeDiff / (1000 * 60 * 60 * 24) + 1) //số ngày còn lại trc khi đi;

            // phải thanh toán trước _book_tours[i].tour_turn.payment_term ngày
            if (days_before_go > parseInt(_book_tours[i].tour_turn.payment_term) && days_before_go <= (parseInt(_book_tours[i].tour_turn.payment_term) + days_need_call)) {
                const payment_term = new Date(_book_tours[i].tour_turn.start_date);
                payment_term.setDate(payment_term.getDate() - parseInt(_book_tours[i].tour_turn.payment_term) - 1);
                payment_term.setHours(23);
                payment_term.setMinutes(59);
                payment_term.setSeconds(59);
                _book_tours[i].dataValues.payment_term = payment_term;
                result.push(_book_tours[i]);
            }
        }
    }
    return result;
}

exports.getListNeedCall = (req, res) => {
    try {
        const default_days_need_call = 2;
        let days_need_call;
        if (typeof req.query.days_need_call === 'undefined') days_need_call = default_days_need_call;
        else days_need_call = req.query.days_need_call
        days_need_call = parseInt(days_need_call);
        const query = {
            where: {
                status: 'booked'
            },
            include: [{
                model: db.tour_turns,
                include: [{
                    model: db.tours,
                    attributes: ['id', 'name']
                }]
            },
            {
                model: db.book_tour_contact_info
            }],
            // attributes: {
            //     include: [
            //         [Sequelize.literal('DATEDIFF(tour_turn.start_date, book_tour_history.book_time) + 1'), 'days'],
            //     ]
            // }
        }
        db.book_tour_history.findAll(query).then(async _book_tours => {
            return res.status(200).json({
                data: await filterBookTourNeedCall(_book_tours, days_need_call)
            })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}