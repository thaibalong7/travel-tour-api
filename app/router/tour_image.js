var router = require('express').Router();
const tour_images = require('../controller/tour_image');
let multer = require('multer');
let upload = multer(); //setting the default folder for multer

router.get('/getByTour/:id', tour_images.getByTour);

router.post('/createByTour', upload.array('image[]'), tour_images.createByTour);

module.exports = router