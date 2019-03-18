var router = require('express').Router();
const routes = require('../controller/route');
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

router.get('/getByTour/:idTour', routes.getByTour);

router.post('/create', routes.create); //middlewareAuthAdmin

router.post('/update', routes.update); //middlewareAuthAdmin

router.get('/getAll', routes.getAll);

router.get('/getById/:id', routes.getById);

router.get('/getAllNotHaveTour', routes.getAllNotHaveTour); //middlewareAuthAdmin

module.exports = router