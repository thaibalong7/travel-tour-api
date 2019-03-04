var router = require('express').Router();
const middlewareAuth = require('../middleware/auth')

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/location', require('./location'));
router.use('/type', require('./type'));
router.use('/tour', require('./tour'));
router.use('/route', require('./route'))
router.use('/tour_turn', require('./tour_turn'));
router.use('/comment', require('./comment'));

module.exports = router