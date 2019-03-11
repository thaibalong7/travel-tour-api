var router = require('express').Router();
const transport = require('../controller/transport');

router.get('/getAll', transport.getAll);

module.exports = router