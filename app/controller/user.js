const db = require('../models');
const users = db.users;
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const helper = require('../helper')
// var fs = require('fs');
// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./app/middleware/private.key', 'utf8');
const signOptions = {
    expiresIn: '1d',
    algorithm: "RS256"
}

exports.register = async (req, res) => {
    try {
        if (await helper.validateEmail(req.body.email)) {
            //true //valid
            if (await helper.validatePhoneNumber(req.body.phone)) {
                //true //valid
                const checkUser = await users.findOne({
                    where: db.sequelize.literal(`email='${req.body.email}' OR phone='${req.body.phone}'`)
                })
                if (!checkUser) {
                    req.body.password = bcrypt.hashSync(req.body.password, null, null).toString();
                    req.body.type = 'local';
                    users.create(req.body).then(async _user => {
                        const token = jwt.sign(
                            {
                                fullname: _user.fullname,
                                id: _user.id,
                                phone: _user.phone,
                                email: _user.email
                            },
                            privateKEY,
                            signOptions
                        )
                        _user = await users.findByPk(_user.id);
                        const user = _.omit(_user.dataValues, 'password');
                        return res.status(200).json({
                            msg: 'Register successful',
                            token: token,
                            profile: user
                        })
                    })
                }
                else {
                    return res.status(400).json({ msg: 'Email or phone number already exists' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Phone number is invalid' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Email is invalid' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.login = async (req, res) => {
    //login by email or phone
    try {
        var query;
        if (await helper.validateEmail(req.body.username)) {
            //login by email
            query = {
                where: {
                    email: req.body.username
                }
            }
        }
        else {
            if (await helper.validatePhoneNumber(req.body.username)) {
                //login by phone
                query = {
                    where: {
                        phone: req.body.username
                    }
                }
            }
            else {
                //err params
                return res.status(405).json({ msg: 'Params is invalid' })
            }
        }
        users.findOne(query).then(async _user => {
            if (!_user)
                return res.status(404).json({ msg: 'Username is not exists' })
            if (bcrypt.compareSync(req.body.password, _user.password)) {
                const token = jwt.sign(
                    {
                        fullname: _user.fullname,
                        id: _user.id,
                        phone: _user.phone,
                        email: _user.email
                    },
                    privateKEY,
                    signOptions
                )
                const user = _.omit(_user.dataValues, 'password');
                if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1)
                    user.avatar = req.headers.host + '/assets/avatar/' + user.avatar;
                return res.status(200).json({
                    msg: 'Auth successful',
                    token: token,
                    profile: user
                })
            }
            else
                return res.status(402).json({ msg: 'Password is not corect' })
        }).catch(err => {
            return res.status(400).json({ msg: err })
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.loginWithFacebook = (req, res) => {
    try {
        const user_facebook = req.body.userData;
        users.findOne({ where: { email: user_facebook.email } }).then(_user => {
            if (_user) {
                //user này có tồn tại trong table user
                const token = jwt.sign(
                    {
                        fullname: _user.fullname,
                        id: _user.id,
                        phone: _user.phone,
                        email: _user.email
                    },
                    privateKEY,
                    signOptions
                )
                const user = _.omit(_user.dataValues, 'password');
                if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1)
                    user.avatar = req.headers.host + '/assets/avatar/' + user.avatar;
                return res.status(200).json({
                    msg: 'Auth successful',
                    token: token,
                    profile: user
                })
            }
            else {
                //user này k tồn tại trong table user
                users.create({
                    email: user_facebook.email,
                    fullname: user_facebook.name,
                    avatar: 'https://graph.facebook.com/' + user_facebook.id + '/picture?width=100',
                    password: bcrypt.hashSync('', null, null).toString(),
                    type: 'facebook'
                }).then(async _user => {
                    const token = jwt.sign(
                        {
                            fullname: _user.fullname,
                            id: _user.id,
                            phone: _user.phone,
                            email: _user.email
                        },
                        privateKEY,
                        signOptions
                    )
                    _user = await users.findByPk(_user.id);
                    const user = _.omit(_user.dataValues, 'password');
                    return res.status(200).json({
                        msg: 'Register and auth successful',
                        token: token,
                        profile: user
                    })
                })
            }
        })
    }
    catch (e) {
        return res.status(400).json({ msg: 'Login fail' })
    }
}


exports.me = (req, res) => {
    try {
        const _user = req.userData;
        _user.password = undefined;
        const user = _.omit(_user.dataValues, 'password');
        if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1)
            user.avatar = req.headers.host + '/assets/avatar/' + user.avatar;
        return res.status(200).json({
            msg: 'Auth successful',
            profile: user
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.updateSex = async (req, res) => {
    const _user = req.userData;
    if (typeof req.body.sex === 'undefined') {
        //err params
        return res.status(405).json({ msg: 'Params is invalid' })
    }
    else {
        _user.sex = req.body.sex;
        await _user.save();
        const user = _.omit(_user.dataValues, 'password');
        if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1)
            user.avatar = req.headers.host + '/assets/avatar/' + user.avatar;
        return res.status(200).json({
            msg: 'Update successful',
            profile: user
        })
    }
}

exports.updateBirthdate = async (req, res) => {
    const _user = req.userData;
    if (typeof req.body.birthdate === 'undefined') {
        //err params
        return res.status(405).json({ msg: 'Params is invalid' })
    }
    else {
        _user.birthdate = req.body.birthdate;
        await _user.save();
        const user = _.omit(_user.dataValues, 'password');
        if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1)
            user.avatar = req.headers.host + '/assets/avatar/' + user.avatar;
        return res.status(200).json({
            msg: 'Update successful',
            profile: user
        })
    }
}

exports.update = async (req, res) => {
    var _user = req.userData;
    if (typeof req.body.birthdate !== 'undefined')
        _user.birthdate = new Date(req.body.birthdate)
    if (typeof req.body.sex !== 'undefined')
        _user.sex = req.body.sex
    if (typeof req.body.phone !== 'undefined')
        _user.phone = req.body.phone
    if (typeof req.body.email !== 'undefined')
        _user.email = req.body.email
    if (typeof req.body.fullname !== 'undefined')
        _user.fullname = req.body.fullname
    if (typeof req.file !== 'undefined') {
        fs.writeFile('public/assets/avatar/' + _user.id + '-' + req.file.originalname, req.file.buffer, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err })
            }
            let avatar = req.headers.host + '/assets/avatar/' + _user.id + '-' + req.file.originalname;
            _user.avatar = _user.id + '-' + req.file.originalname;
            await _user.save();
            _user = await users.findByPk(_user.id);
            const user = _.omit(_user.dataValues, 'password');
            user.avatar = avatar;
            return res.status(200).json({
                msg: 'Update successful',
                profile: user
            })
        })
    }
    else {
        await _user.save();
        _user = await users.findByPk(_user.id);
        const user = _.omit(_user.dataValues, 'password');
        if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1)
            user.avatar = req.headers.host + '/assets/avatar/' + user.avatar;
        return res.status(200).json({
            msg: 'Update successful',
            profile: user
        })
    }
}

exports.logout = (req, res) => {
    try {
        const token = req.headers.authorization;
        db.blacklist_tokens.create({ token: token });
        return res.status(200).json({ msg: 'Logout successful' })
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const _user = req.userData;
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        if (bcrypt.compareSync(old_password, _user.password)) {
            _user.password = bcrypt.hashSync(new_password, null, null).toString();
            await _user.save();
            return res.status(200).json({ msg: 'Update successful' })
        }
        else {
            return res.status(400).json({ msg: 'Old password is not corect' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: err })
    }
}