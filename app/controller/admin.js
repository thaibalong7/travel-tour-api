const db = require('../models');
const admins = db.admins;
const bcrypt = require('bcrypt-nodejs');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require('fs');
const jwt = require('jsonwebtoken');
var upload_image = require('../helper/upload_image');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./app/middleware/private.key', 'utf8');
const signOptions = {
    expiresIn: '1d',
    algorithm: "RS256"
}
exports.register = (req, res) => {
    admins.findAll({ where: { username: req.body.username } }).then(admin => {
        if (admin.length >= 1)
            return res.status(400).json({ msg: 'Username already exists' })
        req.body.password = bcrypt.hashSync(req.body.password, null, null).toString();
        admins.create(req.body).then(_admin => {
            _admin.password = undefined
            return res.status(200).json(_admin)
        }).catch(err => {
            return res.status(400).json({ msg: err })
        })
    })
}

exports.login = (req, res) => {
    admins.findOne({ where: { username: req.body.username } }).then(async _admin => {
        if (!_admin)
            return res.status(400).json({ msg: 'Username is not exists' })
        if (bcrypt.compareSync(req.body.password, _admin.password)) {
            const token = jwt.sign(
                {
                    username: _admin.username,
                    id: _admin.id,
                    role: 'admin'
                },
                privateKEY,
                signOptions
            )
            _admin.password = undefined
            return res.status(200).json({
                msg: 'Auth successful',
                token: token,
                profile: _admin
            })
        }
        return res.status(400).json({ msg: 'Password is not corect' })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.me = (req, res) => {
    const _admin = req.userData;
    _admin.password = undefined;
    return res.status(200).json({
        msg: 'Auth successful',
        profile: _admin
    })
}

exports.uploadImage = (req, res) => {
    upload_image(req, function (err, data) {

        if (err) {
            console.log(err)
            return res.status(400).end(JSON.stringify(err));
        }

        res.send(data);
    });
}

exports.updatePassword = async (req, res) => {
    try {
        const _admin = req.userData;
        if (typeof req.body.old_password !== 'undefined' && typeof req.body.new_password !== 'undefined') {
            const old_password = req.body.old_password;
            const new_password = req.body.new_password;
            if (bcrypt.compareSync(old_password, _admin.password)) {
                _admin.password = bcrypt.hashSync(new_password, null, null).toString();
                await _admin.save();
                return res.status(200).json({ msg: 'Update successful' })
            }
            else {
                return res.status(400).json({ msg: 'Old password is not corect' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.update = async (req, res) => {
    try {
        if (req.userData.fk_role === 1) {//role quản lý
            let _admin = await admins.findByPk(req.body.adminId);
            if (_admin) {
                if (typeof req.body.birthdate !== 'undefined')
                    _admin.birthdate = new Date(req.body.birthdate)
                if (typeof req.body.name !== 'undefined')
                    _admin.name = req.body.name
                // if (typeof req.body.username !== 'undefined')
                //     _admin.username = req.body.username
                if (typeof req.body.fk_role !== 'undefined') {
                    const check_role = await db.roles_admin.findByPk(req.body.fk_role);
                    if (check_role) {
                        _admin.fk_role = req.body.fk_role
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong role id' })
                    }
                }
                await _admin.save();
                _admin.dataValues.password = undefined
                return res.status(200).json({
                    msg: 'Update successful',
                    profile: _admin
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id admin' })
            }
        }
        else {
            return res.status(400).json({ msg: 'You do not have permission to update this information' })
        }
    } catch (error) {
        return res.status(400).json({ msg: err })
    }
}


exports.resetPassword = async (req, res) => {
    try {
        if (req.userData.fk_role === 1) {//role quản lý
            let _admin = await admins.findByPk(req.body.adminId);
            if (_admin) {
                const birthdate = new Date(_admin.birthdate);
                const new_password = '' + (birthdate.getDate() < 10 ? ('0' + birthdate.getDate()) : birthdate.getDate()) + (birthdate.getMonth() < 9 ? ('0' + (birthdate.getMonth() + 1)) : (birthdate.getMonth() + 1)) + birthdate.getFullYear();
                _admin.password = bcrypt.hashSync(new_password, null, null).toString();
                await _admin.save();
                _admin.dataValues.password = undefined
                return res.status(200).json({
                    msg: 'Update successful',
                    profile: _admin
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id admin' })
            }
        }
        else {
            return res.status(400).json({ msg: 'You do not have permission to update this information' })
        }
    } catch (error) {
        return res.status(400).json({ msg: err })
    }
}

function sortListAdmins(admin1, admin2) {
    if (admin1.fk_role === 1 && admin2.fk_role === 2)
        return -1;
    else if (admin1.fk_role === 2 && admin2.fk_role === 1)
        return 1;
    return 0;
}

exports.getListAdmins = async (req, res) => {
    try {
        const query = {
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: db.roles_admin
            }]
        }
        admins.findAll(query).then((_admins) => {
            _admins.sort(sortListAdmins);
            return res.status(200).json({ data: _admins })
        })
    } catch (error) {
        return res.status(400).json({ msg: err })
    }
}

exports.statistics = async (req, res) => {
    try {
        const arr_time = ['month', 'quarters'];
        const time = req.body.time;
        const year = parseInt(req.body.year);
        const index_time = arr_time.indexOf(time);

        function statistic(total_spents, total_proceeds, total_tours, total_passengers) {
            this.total_spents = total_spents;
            this.total_proceeds = total_proceeds;
            this.total_tours = total_tours;
            this.total_passengers = total_passengers;
        }

        //tính số tour đi và số hành khách đã đi
        const query_tour_turn = {
            attributes: {
                include: [
                    [Sequelize.literal('MONTH(start_date)'), 'month_start'], //thêm cột tháng đi
                ]
            },
            where: {
                [Op.and]: [{
                    status: 'public',
                    end_date: {
                        [Op.lte]: new Date() // <= //tức tour đã đi
                    }
                },
                Sequelize.literal('YEAR(start_date) = ' + year) //năm đi bằng year
                ]
            }
        }
        const result = new Array(12);
        for (let i = 0, l = result.length; i < l; i++) {
            result[i] = new statistic(0, 0, 0, 0)
        }

        const _tour_turn = await db.tour_turns.findAll(query_tour_turn);
        for (let i = 0, l = _tour_turn.length; i < l; i++) {
            result[parseInt(_tour_turn[i].dataValues.month_start) - 1].total_tours += 1; //thêm 1 tour đi
            result[parseInt(_tour_turn[i].dataValues.month_start) - 1].total_passengers += parseInt(_tour_turn[i].num_current_people);
        }

        //tính số tiền nhận được (tiền nhận từ thanh toán vé)
        const query_book_tour = {
            attributes: {
                include: [
                    [Sequelize.literal('MONTH(book_time)'), 'month_book'], //thêm cột tháng đi
                ]
            },
            where: {
                [Op.and]: [{
                    status: {
                        [Op.or]: ['paid', 'finished', 'pending_cancel', 'confirm_cancel', 'refunded', 'not_refunded'] //lấy hết những book tour ngoại trừ status booked hay cancelled (mấy cái này chưa thanh toán)
                    }
                },
                Sequelize.literal('YEAR(book_time) = ' + year) //năm đi bằng year
                ]
            }
        }
        const _book_tour = await db.book_tour_history.findAll(query_book_tour);
        for (let i = 0, l = _book_tour.length; i < l; i++) {
            result[parseInt(_book_tour[i].dataValues.month_book) - 1].total_proceeds += parseInt(_book_tour[i].total_pay)
        }

        //tính số tiền chi trả (trả tiền hoàn vé)
        const query_cancel_book_tour = {
            attributes: {
                include: [
                    [Sequelize.literal('MONTH(refunded_time)'), 'month_refunded'], //thêm cột tháng đi
                ]
            },
            where: {
                [Op.and]: [
                    Sequelize.literal('YEAR(book_time) = ' + year) //năm đi bằng year
                ]
            },
            include: [{
                model: db.book_tour_history,
                where: {
                    status: 'refunded' //đã nhận tiền hoàn trả mới tính
                }
            }]
        }
        const _cancel_book_tour = await db.cancel_booking.findAll(query_cancel_book_tour);
        for (let i = 0, l = _cancel_book_tour.length; i < l; i++) {
            if (parseInt(_cancel_book_tour[i].money_refunded) > 0)
                result['' + parseInt(_cancel_book_tour[i].dataValues.month_refunded) - 1].total_spents += parseInt(_cancel_book_tour[i].money_refunded)
        }


        if (index_time === 0) { //tính theo tháng
            return res.status(200).json({ data: result })
        }
        else if (index_time === 1) { //tính theo quý
            const result_quarters = new Array(4);
            for (let i = 0, l = result_quarters.length; i < l; i++) {
                result_quarters[i] = new statistic(0, 0, 0, 0)
            }
            for (let i = 0, l = result.length; i < l; i++) {
                const th_quaters = Math.floor(i / 3); //1 năm 4 quý, mỗi quý 3 tháng
                result_quarters[th_quaters].total_passengers += result[i].total_passengers;
                result_quarters[th_quaters].total_tours += result[i].total_tours;
                result_quarters[th_quaters].total_proceeds += result[i].total_proceeds;
                result_quarters[th_quaters].total_spents += result[i].total_spents;
            }
            return res.status(200).json({ data: result_quarters })
        }
        else {
            return res.status(400).json({ msg: "Wrong params time" })
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}
