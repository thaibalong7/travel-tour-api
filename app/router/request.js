var router = require('express').Router();
const requests = require('../controller/request');

router.post('/create', requests.create);

module.exports = router