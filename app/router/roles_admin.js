var router = require('express').Router();
const roles_admin = require('../controller/roles_admin');
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

router.get('/getAll', roles_admin.getAll);

router.post('/create', roles_admin.create); //middlewareAuthAdmin

router.post('/update', roles_admin.update); //middlewareAuthAdmin

router.get('/getById/:id', roles_admin.getById)

module.exports = router