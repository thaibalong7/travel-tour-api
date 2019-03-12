var router = require('express').Router();
const routes = require('../controller/route');

router.get('/getByTour/:idTour', routes.getByTour);

router.post('/create', routes.create);

router.post('/update', routes.update);

router.get('/getALl', routes.getAll);

router.get('/getById/:id', routes.getById);

module.exports = router