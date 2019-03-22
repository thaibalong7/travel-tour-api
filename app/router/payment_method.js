var router = require('express').Router();
const payment_method = require('../controller/payment_method')

router.get('/getAll', payment_method.getAll);

router.post('/create', payment_method.create);

router.post('/update', payment_method.update);

module.exports = router;