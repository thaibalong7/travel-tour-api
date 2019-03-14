var router = require('express').Router();
const tour_images = require('../controller/tour_image');

router.get('/getByTour/:id', tour_images.getByTour);

module.exports = router