var router = require('express').Router();
const tour_images = require('../controller/tour_image');
let multer = require('multer');
let upload = multer(); //setting the default folder for multer
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

router.get('/getByTour/:id', tour_images.getByTour);

router.post('/createByTour', upload.array('image[]'), tour_images.createByTour); //middlewareAuthAdmin

module.exports = router