var router = require('express').Router();
const admins = require('../controller/admin');
const { middlewareAuthAdmin } = require('../middleware/auth')

router.post('/register', admins.register);
router.post('/login', admins.login);
router.get('/me', middlewareAuthAdmin, admins.me);

module.exports = router