var router = require('express').Router();
const types = require('../controller/type')

router.get('/getAllType', types.getAllType);
router.post('/create', types.create);

module.exports = router;