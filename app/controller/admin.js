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

exports.getListAdmins = async (req, res) => {
    try {
        const query = {
            attributes: {
                exclude: ['password']
            }
        }
        admins.findAll(query).then((_admins) => {
            return res.status(200).json({ data: _admins })
        })
    } catch (error) {
        return res.status(400).json({ msg: err })
    }
}
