const db = require('../models');
const admins = db.admins;
const bcrypt = require('bcrypt-nodejs');

const fs = require('fs');
const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./app/middleware/private.key', 'utf8');
const signOptions = {
    expiresIn: '1d',
    algorithm: "RS256"
}
exports.register = (req, res) => {
    admins.findAll({ where: { username: req.body.username } }).then(admin => {
        if (admin.length >= 1)
            return res.status(403).json({ msg: 'Username already exists' })
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
            return res.status(404).json({ msg: 'Username is not exists' })
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
        return res.status(402).json({ msg: 'Password is not corect' })
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