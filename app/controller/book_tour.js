const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const validate_helper = require('../helper/validate');

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
        await cb(arr[i]);
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
            const _tour_turn = await db.tour_turns.findByPk(req.body.idTour_Turn);
            if (_tour_turn) {
                if (_tour_turn.status === 'private' || new Date(_tour_turn.start_date) <= new Date()) //tour turn là private hoặc đã đi rồi
                    return res.status(400).json({ msg: 'Wrong tour turn' });
            }
            else { //id tour turn truyền vào không có trong db
                return res.status(400).json({ msg: 'Wrong tour turn' });
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

            //pass hết các kiểm tra hợp lệ
            if (req.body.payment === 'Incash') {

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
                        fk_payment: payment.id
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
                            if (typeof passenger.phone !== 'undefined') //k bắt buộc
                                new_passenger.phone = passenger.phone
                            if (typeof passenger.passport !== 'undefined') //k bắt buộc
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
                            msg: 'Book tour successfull',
                            book_tour: _book_tour,
                            contact_info: _contact_info
                        });
                    })

                })
            }
            else {
                //phương thức thanh toán khác ngoài Incash
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
        if (typeof req.headers.authorization !== 'undefined') {
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