var router = require('express').Router();
const tours = require('../controller/tour');
let multer = require('multer');
let upload = multer(); //setting the default folder for multer
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

// example call api: http://localhost:5000/tour/getAll?per_page=10&page=2
router.get('/getAll', tours.getAllTour);

router.post('/createWithRoutes', upload.single('image'), tours.createWithRoutes); //middlewareAuthAdmin

router.post('/createWithRoutesAndListImage', upload.any('featured_image', 'list_image'), tours.createWithRoutesAndListImage) //middlewareAuthAdmin

router.post('/create', tours.create); //middlewareAuthAdmin

router.post('/updateWithRoutes', upload.single('image'), tours.updateWithRoutes); //middlewareAuthAdmin

router.post('/updateWithRoutesAndListImage', upload.any('featured_image', 'new_images'), tours.updateWithRoutesAndListImage); //middlewareAuthAdmin

router.get('/getById/:id', tours.getById);

// Gởi lên id location, trả về những tour đi ngang qua điểm đó (những tour phải có tour_turns còn nhận book)
// example call api http://localhost:5000/tour/getByLocation?idLocation=26&per_page=3&page=1
router.get('/getByLocation', tours.getByLocation);

router.get('/searchByName', tours.searchByName);

router.get('/searchByPrice', tours.searchByPrice);

router.get('/getAllWithoutPagination', tours.getAllWithoutPagination);

module.exports = router