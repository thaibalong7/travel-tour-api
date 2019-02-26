const db = require('../models');
const users = db.users;
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
    users.findAll({ where: { username: req.body.username } }).then(user => {
        if (user.length >= 1)
            return res.status(403).json({ msg: 'Username already exists' })
        req.body.password = bcrypt.hashSync(req.body.password, null, null).toString();
        users.create(req.body).then(_user => {
            _user.password = undefined
            return res.status(200).json(_user)
        }).catch(err => {
            return res.status(400).json({ msg: err })
        })
    })
}

exports.login = (req, res) => {
    users.findOne({ where: { username: req.body.username } }).then(async _user => {
        if (!_user)
            return res.status(404).json({ msg: 'Username is not exists' })
        if (bcrypt.compareSync(req.body.password, _user.password)) {
            const token = jwt.sign(
                {
                    username: _user.username,
                    id: _user.id
                },
                privateKEY,
                signOptions
            )
            _user.password = undefined
            return res.status(200).json({
                msg: 'Auth successful',
                token: token,
                profile: _user
            })
        }
        else
            return res.status(402).json({ msg: 'Password is not corect' })
    }).catch(err => {
        return res.status(400).json({ msg: err })
    })

}

exports.me = (req, res) => {
    const _user = req.userData;
    _user.password = undefined;
    return res.status(200).json({
        msg: 'Auth successful',
        profile: _user
    })
}