const db = require('../models');
const users = db.users;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    users.findAll({ where: { username: req.body.username } }).then(user => {
        if (user.length >= 1)
            return res.status(400).json({ msg: 'Username already exists' })
    })
    req.body.password = bcrypt.hashSync(req.body.password, null, null).toString();
    users.create(req.body).then(_user => {
        _user.password = undefined
        return res.status(200).json(_user)
    }).catch(err => {
        return res.status(400).json({ msg: err })
    })
}

exports.login = (req, res) => {
    users.findOne({ where: { username: req.body.username } }).then(_user => {
        if (!_user)
            return res.status(400).json({ msg: 'Username is not exists' })
        if (bcrypt.compareSync(req.body.password, _user.password)) {
            const token = jwt.sign(
                {
                    username: _user.username,
                    id: _user.id
                },
                'secret_key',
                {
                    expiresIn: '1h'
                }
            )
            _user.password = undefined
            return res.status(200).json({
                message: 'Auth successful',
                token: token,
                profile: _user
            })
        }
        return res.status(401).json({ msg: 'Password is not corect' })
    }).catch(err => {
        res.status(402).json({ msg: err })
    })

}

exports.me = (req, res) => {
    const username = req.userData.username;
    users.findOne({ where: { username: username } }).then(_user => {
        if (!_user)
            return res.status(400).json({ msg: "User is not exists" })
        else {
            _user.password = undefined
            return res.status(200).json({
                message: 'Auth successful',
                profile: _user
            })
        }
    })

}