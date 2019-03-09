var router = require('express').Router();
const tour_turns = require('../controller/tour_turn');

router.get('/getByTour/:idTour', tour_turns.getByTour);

router.post('/create', tour_turns.create);

module.exports = router