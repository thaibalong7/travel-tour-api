var router = require('express').Router();
const reviews = require('../controller/reviews');

router.post('/create', reviews.create);

router.get('/getByTour/:idTour', reviews.getByTour);

module.exports = router