const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const validate_helper = require('../helper/validate');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const uuidv1 = require('uuid/v1');

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

const book_tour = async (req, res, _user) => {
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
    //     passport, //not require
    //     type //
    // }

    try {
        //check req.body
        if (typeof req.body.fullname !== 'undefined' && typeof req.body.phone !== 'undefined' //những thuộc tính này là bắt buộc
            && typeof req.body.email !== 'undefined' && typeof req.body.address !== 'undefined'
            && typeof req.body.passengers !== 'undefined' && typeof req.body.total_pay !== 'undefined'
            && typeof req.body.idTour_Turn !== 'undefined' && typeof req.body.payment !== 'undefined') {
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
            if (req.body.payment === 'incash' || req.body.payment === 'transfer') { //thanh toán tiền mặt hoặc chuyển khoảng ngân hàng

                var new_contact_info = {
                    email: req.body.email,
                    fullname: req.body.fullname,
                    phone: req.body.phone,
                    address: req.body.address,
                }
                if (_user !== null) { //check có user hay k
                    new_contact_info.fk_user = _user.id
                }
                //tạo contact info trước
                db.book_tour_contact_info.create(new_contact_info).then((_contact_info) => {
                    //tạo xong và có id
                    let payment = _payments.find(p => p.name === req.body.payment);
                    //lấy id của contact info tạo book tour

                    const new_book_tour = {
                        book_time: new Date(),
                        num_passenger: req.body.passengers.length,
                        total_pay: req.body.total_pay,
                        fk_contact_info: _contact_info.id,
                        fk_tour_turn: req.body.idTour_Turn,
                        fk_payment: payment.id,
                        code: uuidv1()
                    };
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
                        return res.status(200).json({
                            msg: 'Book tour successful',
                            book_tour: _book_tour,
                            contact_info: _contact_info
                        });
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
        console.log(err);
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
            book_tour(req, res, null);
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}

const check_policy_cancel_booking = async (booking) => {
    //check theo tour turn của booking này
    if (booking.request_cancel_bookings.length !== 0) { //đã gởi request thì k đc gởi lại
        return false;
    }
    return true; //tạm thời
}

const add_is_cancel_booking = async (list_booking) => { //thêm 1 record là dựa vào policy thì hiện giờ có thể hủy đặt tour hay k
    for (var i = 0; i < list_booking.length; i++) {
        list_booking[i].dataValues.isCancelBooking = await check_policy_cancel_booking(list_booking[i]);
        list_booking[i].dataValues.request_cancel_bookings = list_booking[i].dataValues.request_cancel_bookings[0]
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
                attributes: { exclude: ['fk_contact_info'] },
                include: [{
                    model: db.book_tour_contact_info,
                    where: {
                        fk_user: _user.id
                    }
                },
                {
                    attributes: ['id', 'status'],
                    model: db.request_cancel_booking
                }],
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
                await add_is_cancel_booking(_book_tour_history.rows);
                return res.status(200).json({
                    itemCount: _book_tour_history.count, //số lượng record được trả về
                    data: _book_tour_history.rows,
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
                    model: db.request_cancel_booking
                }]
            }
            db.book_tour_history.findOne(query).then(async _book_tour_history => {
                if (_book_tour_history) {
                    const tour_turn = await db.tour_turns.findOne({
                        where: {
                            id: _book_tour_history.fk_tour_turn
                        },
                        attributes: { exclude: ['fk_tour'] },
                        include: [{
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
                                tour_turn.tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
                            else
                                tour_turn.tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
                        }
                        _book_tour_history.dataValues.tour_turn = tour_turn
                    }
                    _book_tour_history.dataValues.type_passenger_detail = type_passenger_detail
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
            if (!isNaN(idBook_tour)) {
                page = parseInt(page);
                per_page = parseInt(per_page);
                var query = {
                    attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                    where: {
                        fk_book_tour: idBook_tour
                    },
                    include: [{
                        model: db.type_passenger
                    }],
                    limit: per_page,
                    offset: (page - 1) * per_page
                }
                db.passengers.findAndCountAll(query).then(_passengers => {
                    var next_page = page + 1;
                    //Kiểm tra còn dữ liệu không
                    if ((parseInt(_passengers.rows.length) + (next_page - 2) * per_page) === parseInt(_passengers.count))
                        next_page = -1;
                    //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                    if ((parseInt(_passengers.rows.length) < per_page))
                        next_page = -1;
                    if (parseInt(_passengers.rows.length) === 0)
                        next_page = -1;
                    return res.status(200).json({
                        itemCount: _passengers.count, //số lượng record được trả về
                        data: _passengers.rows,
                        next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                    })
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id' })
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.getAllBookTourHistoryWithoutPagination = (req, res) => {
    try {
        const status = req.query.status;
        const include_tour_turn = {
            attributes: { exclude: ['fk_tour'] },
            model: db.tour_turns,
            include: [{
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
        db.book_tour_history.findAll(query).then((_book_tours) => {
            return res.status(200).json({ data: _book_tours })
        })
    } catch (error) {
        return res.status(400).json({ msg: error.toString() });
    }
}

exports.getHistoryBookTourByCode = (req, res) => {
    try {
        const code = req.params.code;
        var is_info_tour = (req.query.tour == 'true');
        var query = {
            attributes: { exclude: ['fk_contact_info', 'fk_payment'] },
            where: {
                code: code
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
            }
            ]
        }
        db.book_tour_history.findOne(query).then(async _book_tour_history => {
            if (_book_tour_history) {
                const tour_turn = await db.tour_turns.findOne({
                    where: {
                        id: _book_tour_history.fk_tour_turn
                    },
                    attributes: { exclude: ['fk_tour'] },
                    include: [{
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
                        type: type.name,
                        num_passenger: list_passenger.length,
                        price: price_of_type
                    }
                })
                tour_turn.discount = parseFloat(tour_turn.discount / 100);
                if (is_info_tour) { //nếu lấy thêm thông tin tour turn nữa
                    if (tour_turn.tour.featured_img !== null) {
                        if (process.env.NODE_ENV === 'development')
                            tour_turn.tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
                        else
                            tour_turn.tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
                    }
                    _book_tour_history.dataValues.tour_turn = tour_turn
                }
                _book_tour_history.dataValues.type_passenger_detail = type_passenger_detail
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
            ]
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
        console.error(error);
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
                return res.status(200).json({
                    data: {
                        tour_turn: tour_turn,
                        book_tour_history: _book_tours
                    }
                })
            })
        }
    } catch (error) {
        console.error(error);
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
            if (book_tour.status === 'booked') {
                book_tour.status = 'paid' //chuyển thành status đã thanh toán
                await book_tour.save();
                return res.status(200).json({
                    msg: 'Pay successful',
                    data: book_tour
                })
            }
            if (book_tour.status === 'paid') {
                return res.status(400).json({ msg: 'This booking has been paid' });
            }
            if (book_tour.status === 'cancelled') {
                return res.status(400).json({ msg: 'This booking has been cancelled' });
            }

        }
        else {
            return res.status(400).json({ msg: 'Wrong code' });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: error.toString() });
    }
}