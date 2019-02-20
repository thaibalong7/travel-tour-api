var router = require('express').Router();

var middlewareAuth = (req, res, next) => {
    // var token = req.body.token || req.query.token || req.header['x-access-token'];
    console.log('Middleware is running')
    next();
}

router.use('/location', middlewareAuth, require('./location'));
router.use('/type', middlewareAuth, require('./type'));

module.exports = router