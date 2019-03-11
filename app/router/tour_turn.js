var router = require('express').Router();
const tour_turns = require('../controller/tour_turn');

router.get('/getByTour/:idTour', tour_turns.getByTour);

router.post('/create', tour_turns.create);

//example call api: http://localhost:5000/tour_turn/getById/2 
router.get('/getById/:id', tour_turns.getById)

//example call api: http://localhost:5000/tour_turn/getAllWithoutPagination
router.get('/getAllWithoutPagination', tour_turns.getAllWithoutPagination);

router.post('/update', tour_turns.update);

module.exports = router