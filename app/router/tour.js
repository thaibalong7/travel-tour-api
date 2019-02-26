var router = require('express').Router();
const tours = require('../controller/tour');

// example call api: http://localhost:5000/tour/getAll?per_page=10&page=2
router.get('/getAll', tours.getAllTour);

router.get('/getById/:id', tours.getById);

module.exports = router