var router = require('express').Router();
const transport = require('../controller/transport');

router.get('/getAll', transport.getAll);

router.post('/create', transport.create);

router.post('/update', transport.update);

router.get('/getById/:id', transport.getById)

module.exports = router