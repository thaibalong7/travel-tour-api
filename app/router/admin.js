var router = require('express').Router();
const admins = require('../controller/admin');
const { middlewareAuthAdmin } = require('../middleware/auth')

router.post('/register', admins.register);
router.post('/login', admins.login);
router.post('/upload_image', admins.uploadImage);
router.get('/me', middlewareAuthAdmin, admins.me);

router.post('/updatePassword', middlewareAuthAdmin, admins.updatePassword);
router.get('/getListAdmins', admins.getListAdmins);

router.post('/update', middlewareAuthAdmin, admins.update);

router.post('/resetPassword', middlewareAuthAdmin, admins.resetPassword);

router.post('/statistics', admins.statistics);

module.exports = router;