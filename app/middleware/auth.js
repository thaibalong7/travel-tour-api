const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../models')
const users = db.users
const admins = db.admins
var publicKEY = fs.readFileSync('./app/middleware/public.key', 'utf8');
var verifyOptions = {
    expiresIn: '30d',
    algorithm: "RS256"
}

var middlewareAuthUser = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decode = jwt.verify(token, publicKEY, verifyOptions);
        db.blacklist_tokens.findOne({ where: { token: token } }).then(_blacktoken => {
            if (!_blacktoken) {
                users.findByPk(decode.id).then(_user => {
                    if (!_user) {
                        res.status(401).json({ msg: 'Auth failed' });
                    }
                    else {
                        req.userData = _user;
                        next();
                    }
                })
            }
            else
                res.status(401).json({ msg: 'Auth failed' });
        })
    } catch (error) {
        res.status(401).json({ msg: 'Auth failed' });
    }
}

var middlewareAuthAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decode = jwt.verify(token, publicKEY, verifyOptions);
        admins.findOne({ where: { username: decode.username } }).then(_admin => {
            if (!_admin) {
                res.status(401).json({ msg: 'Auth failed' });
            }
            else {
                if (decode.role === 'admin') {
                    req.userData = _admin;
                    next();
                }
                else res.status(401).json({ msg: 'Auth failed' });
            }
        })

    } catch (error) {
        res.status(401).json({ msg: 'Auth failed' });
    }
}


module.exports = { middlewareAuthUser, middlewareAuthAdmin };