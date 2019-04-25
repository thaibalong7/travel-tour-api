const db = require('../models');
const users = db.users;
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const validate_helper = require('../helper/validate');
const { sendVerifyEmail, sendForgetPasswordEmail } = require('../helper/send_email');
const crypto = require('crypto');
const link_img = require('../config/setting').link_img;

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY = fs.readFileSync('./app/middleware/private.key', 'utf8');
const signOptions = {
    expiresIn: '30d',
    algorithm: "RS256"
}

exports.register = async (req, res) => {
    try {
        if (await validate_helper.validateEmail(req.body.email)) {
            //true //valid
            if (await validate_helper.validatePhoneNumber(req.body.phone)) {
                //true //valid
                const checkUser = await users.findOne({
                    where: db.sequelize.literal(`email='${req.body.email}' OR phone='${req.body.phone}'`)
                })
                if (!checkUser) {
                    //user chưa tồn tại
                    req.body.password = bcrypt.hashSync(req.body.password, null, null).toString();
                    req.body.type = 'local';
                    req.body.isActive = false;
                    users.create(req.body).then(async _user => {
                        // const token = jwt.sign(
                        //     {
                        //         fullname: _user.fullname,
                        //         id: _user.id,
                        //         phone: _user.phone,
                        //         email: _user.email
                        //     },
                        //     privateKEY,
                        //     signOptions
                        // )
                        // _user = await users.findByPk(_user.id);
                        // const user = _.omit(_user.dataValues, 'password');
                        // return res.status(200).json({
                        //     msg: 'Register successful',
                        //     token: token,
                        //     profile: user
                        // })
                        const token_validate = crypto.randomBytes(20).toString('hex');
                        db.verification_token.create({
                            user_id: _user.id,
                            token: token_validate
                        }).then((_verification_token) => {
                            sendVerifyEmail(token_validate, _user.email, req, res)
                        }).catch(err => {
                            return res.status(400).json({ msg: err })
                        })
                    }).catch(err => {
                        return res.status(400).json({ msg: err })
                    })
                }
                else {
                    if (checkUser.isActive === false) {
                        return res.status(400).json({ msg: 'Email or phone number already exists but not verify' })
                    }
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

exports.verify = (req, res) => {
    try {
        const token = req.query.sign;
        if (typeof token === 'undefined') {
            return res.status(400).json({ msg: err })
        }
        else {
            db.verification_token.findOne({ where: { token: token } }).then(async _verification_token => {
                if (_verification_token) {
                    _user = await users.findByPk(_verification_token.user_id);
                    if (_user) {
                        _user.isActive = true;
                        await _user.save();
                        await _verification_token.destroy();
                        if (process.env.NODE_ENV === 'development') {
                            res.redirect('http://localhost:3000/login')
                        }
                        else {
                            res.redirect('https://localhost:3000/login')
                        }
                        // return res.status(200).json({ msg: 'Verification successful' })
                    }
                    else {
                        //user_id k đúng
                        // res.render('alert', { msg: 'Verification failed' });
                        return res.status(400).json({ msg: 'Verification failed' })
                    }
                }
                else {
                    //token k còn trong db
                    // res.render('alert', { msg: 'Token expired' });
                    return res.status(400).json({ msg: 'Token expired' })
                }
            }).catch(err => {
                // res.render('alert', { msg: 'Verification failed' });
                return res.status(400).json({ msg: err })
            })
        }
    }
    catch (err) {
        res.render('alert', { msg: 'Verification failed' });
        // return res.status(400).json({ msg: err })
    }
}

exports.login = async (req, res) => {
    //login by email or phone
    try {
        var query;
        if (await validate_helper.validateEmail(req.body.username)) {
            //login by email
            query = {
                where: {
                    email: req.body.username
                }
            }
        }
        else {
            if (await validate_helper.validatePhoneNumber(req.body.username)) {
                //login by phone
                query = {
                    where: {
                        phone: req.body.username
                    }
                }
            }
            else {
                //err params
                return res.status(400).json({ msg: 'Params is invalid' })
            }
        }
        users.findOne(query).then(async _user => {
            if (!_user)
                return res.status(400).json({ msg: 'Username is not exists' })
            if (_user.isActive === true) {
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
                    if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1) {
                        if (process.env.NODE_ENV === 'development')
                            user.avatar = 'http://' + req.headers.host + link_img.link_avatar_user + user.avatar;
                        else
                            user.avatar = 'https://' + req.headers.host + link_img.link_avatar_user + user.avatar;
                    }
                    return res.status(200).json({
                        msg: 'Auth successful',
                        token: token,
                        profile: user
                    })
                }
                else
                    return res.status(400).json({ msg: 'Password is not corect' })
            }
            else {
                return res.status(400).json({ msg: 'This email does not verify' })
            }
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
                if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1) {
                    if (process.env.NODE_ENV === 'development')
                        user.avatar = 'http://' + req.headers.host + link_img.link_avatar_user + user.avatar;
                    else
                        user.avatar = 'https://' + req.headers.host + link_img.link_avatar_user + user.avatar;
                }
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
        if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1) {
            if (process.env.NODE_ENV === 'development')
                user.avatar = 'http://' + req.headers.host + link_img.link_avatar_user + user.avatar;
            else
                user.avatar = 'https://' + req.headers.host + link_img.link_avatar_user + user.avatar;
        }
        return res.status(200).json({
            msg: 'Auth successful',
            profile: user
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err })
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
    if (typeof req.body.fullname !== 'undefined')
        _user.fullname = req.body.fullname
    if (typeof req.body.address !== 'undefined')
        _user.address = req.body.address
    if (typeof req.file !== 'undefined') {
        var date = new Date();
        var timestamp = date.getTime();
        fs.writeFile('public' + link_img.link_avatar_user + _user.id + '-' + timestamp + '.jpg', req.file.buffer, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err })
            }
            if (_user.avatar !== null) {
                //đã có avatar rồi
                //xóa avt cũ
                fs.unlink('public' + link_img.link_avatar_user + _user.avatar, (err) => {
                    if (err) {
                        console.error(err)
                    }
                });
            }
            _user.avatar = _user.id + '-' + timestamp + '.jpg';
            let avatar;
            if (process.env.NODE_ENV === 'development')
                avatar = 'http://' + req.headers.host + link_img.link_avatar_user + _user.avatar;
            else
                avatar = 'https://' + req.headers.host + link_img.link_avatar_user + _user.avatar;
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
        if (user.avatar !== null && user.avatar.indexOf('graph.facebook.com') === -1) {
            if (process.env.NODE_ENV === 'development')
                user.avatar = 'http://' + req.headers.host + link_img.link_avatar_user + user.avatar;
            else
                user.avatar = 'https://' + req.headers.host + link_img.link_avatar_user + user.avatar;
        }
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
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const password = Math.floor((Math.random() * 1000000000) + 10000000);
        const hashPassword = bcrypt.hashSync(password, null, null).toString();
        const _user = await users.findOne({ where: { email: req.body.email } });
        if (_user) {
            _user.password = hashPassword;
            sendForgetPasswordEmail(password, _user, req, res);
        }
        else {
            return res.status(400).json({ msg: "Email is not exists" })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }

}

exports.getAllUser = async (req, res) => {
    try {
        const _users = await users.findAll();
        return res.status(200).json({
            data: _users
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.testSendEmail = (req, res) => {
    const verificationEmail_data = {
        token: 'asdasdasdasdasd',
        email: 'thaibalong7@gmail.com',
        new_password: 'asdasdasdasd'
    }
    sendForgetPasswordEmail(verificationEmail_data, req, res)
}