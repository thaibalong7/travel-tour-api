var router = require('express').Router();
const jwt = require('jsonwebtoken');
var middlewareAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decode = jwt.verify(token, 'secret_key');
        req.userData = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Auth failed' });
    }
}
router.use('/user', require('./user'));
router.use('/location', middlewareAuth, require('./location'));
router.use('/type', middlewareAuth, require('./type'));

module.exports = router