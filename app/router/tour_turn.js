var router = require('express').Router();
const tour_turns = require('../controller/tour_turn');
const { middlewareAuthUser, middlewareAuthAdmin } = require('../middleware/auth')

router.get('/getByTour/:idTour', tour_turns.getByTour);

router.post('/create', tour_turns.create); //middlewareAuthAdmin

//example call api: http://localhost:5000/tour_turn/getById/2 
router.get('/getById/:id', tour_turns.getById)

//example call api: http://localhost:5000/tour_turn/getAllWithoutPagination
router.get('/getAllWithoutPagination', tour_turns.getAllWithoutPagination); //middlewareAuthAdmin

//example call api: http://localhost:5000/tour_turn/getAll?page=1&per_page=4&isUniqueTour=true
router.get('/getAll', tour_turns.getAll);

router.post('/update', tour_turns.update); //middlewareAuthAdmin

module.exports = router