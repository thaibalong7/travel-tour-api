var router = require('express').Router();
const users = require('../controller/user');
const { middlewareAuthUser } = require('../middleware/auth')

router.post('/register', users.register);
router.post('/login', users.login);
router.get('/me', middlewareAuthUser, users.me);

module.exports = router