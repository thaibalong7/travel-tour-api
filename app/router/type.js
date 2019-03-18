var router = require('express').Router();
const types = require('../controller/type')
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

router.get('/getAll', types.getAllType);

router.post('/create', types.create); //middlewareAuthAdmin

router.post('/update', types.update); //middlewareAuthAdmin

module.exports = router;