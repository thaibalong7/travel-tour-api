var router = require('express').Router();
const tour_classification = require('../controller/tour_classification');

router.get('/getTourTurnByCountry/:id', tour_classification.getTourTurnByCountry);

router.get('/getTourTurnByProvince/:id', tour_classification.getTourTurnByProvince);

router.get('/getTourTurnByType/:id', tour_classification.getTourTurnByType);

router.get('/getAllCountries', tour_classification.getAllCountries);

router.get('/getAllProvincesByCountry/:id', tour_classification.getAllProvincesByCountry);

router.get('/getAllTypeTour', tour_classification.getAllTypeTour);

module.exports = router