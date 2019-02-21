var router = require('express').Router();
const middlewareAuth = require('../middleware/auth')


router.use('/user', require('./user'));
router.use('/location', require('./location'));
router.use('/type', require('./type'));

module.exports = router