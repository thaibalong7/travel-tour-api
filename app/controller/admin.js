const db = require('../models');
const admins = db.admins;
const bcrypt = require('bcrypt-nodejs');

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
                if (typeof req.body.username !== 'undefined')
                    _admin.username = req.body.username
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
