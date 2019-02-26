var router = require('express').Router();
const tour_turns = require('../controller/tour_turn');

router.get('/getByTour/:idTour', tour_turns.getByTour);

module.exports = router