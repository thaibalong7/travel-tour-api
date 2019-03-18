var router = require('express').Router();
const users = require('../controller/user');
const { middlewareAuthUser } = require('../middleware/auth')
let multer = require('multer');
let upload = multer(); //setting the default folder for multer


router.post('/register', users.register);

router.post('/login', users.login);

router.get('/verify', users.verify);

router.post('/loginWithFacebook', users.loginWithFacebook);

router.post('/forgetPassword', users.forgetPassword);

router.get('/me', middlewareAuthUser, users.me);

router.put('/updateSex', middlewareAuthUser, users.updateSex);
router.put('/updateBirthdate', middlewareAuthUser, users.updateBirthdate);
router.put('/updatePassword', middlewareAuthUser, users.updatePassword);
router.put('/update', middlewareAuthUser, upload.single('avatar'), users.update);

router.get('/logout', middlewareAuthUser, users.logout);

module.exports = router