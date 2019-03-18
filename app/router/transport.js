var router = require('express').Router();
const transport = require('../controller/transport');
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

router.get('/getAll', transport.getAll);

router.post('/create', transport.create); //middlewareAuthAdmin

router.post('/update', transport.update); //middlewareAuthAdmin

router.get('/getById/:id', transport.getById)

module.exports = router