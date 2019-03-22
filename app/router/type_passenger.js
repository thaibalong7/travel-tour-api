var router = require('express').Router();
const type_passenger = require('../controller/type_passenger')

router.get('/getAll', type_passenger.getAll);

router.post('/create', type_passenger.create);

router.post('/update', type_passenger.update);

module.exports = router;