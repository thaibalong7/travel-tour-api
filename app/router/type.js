var router = require('express').Router();
const types = require('../controller/type')

router.get('/getAll', types.getAllType);
router.post('/create', types.create);

module.exports = router;