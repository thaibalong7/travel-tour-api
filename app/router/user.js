var router = require('express').Router();
const users = require('../controller/user');

router.post('/register', users.register);
router.post('/login', users.login);

module.exports = router