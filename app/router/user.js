var router = require('express').Router();
const users = require('../controller/user');
const middlewareAuth = require('../middleware/auth')

router.post('/register', users.register);
router.post('/login', users.login);
router.get('/me', middlewareAuth, users.me);

module.exports = router