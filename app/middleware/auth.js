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

module.exports = middlewareAuth;