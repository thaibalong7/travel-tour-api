var router = require('express').Router();
const routes = require('../controller/route');

router.get('/getByTour/:idTour', routes.getByTour)

module.exports = router