var router = require('express').Router();
const tour_classification = require('../controller/tour_classification');

router.get('/getTourTurnByCountry/:id', tour_classification.getTourTurnByCountry);

router.get('/getTourTurnByProvince/:id', tour_classification.getTourTurnByProvince);

router.get('/getTourTurnByType/:id', tour_classification.getTourTurnByType);

router.get('/getAllCountries', tour_classification.getAllCountries);

router.get('/getAllProvincesByCountry/:id', tour_classification.getAllProvincesByCountry);

router.get('/getAllCountries_admin', tour_classification.getAllCountries_admin); //middlewareAuthAdmin

router.get('/getAllProvincesByCountry_admin/:id', tour_classification.getAllProvincesByCountry_admin); //middlewareAuthAdmin

router.get('/getAllProvinces_admin', tour_classification.getAllProvinces_admin); //middlewareAuthAdmin

router.post('/createTypeTour', tour_classification.createTypeTour); //middlewareAuthAdmin

router.post('/updateTypeTour', tour_classification.updateTypeTour); //middlewareAuthAdmin

router.post('/createCountry', tour_classification.createCountry); //middlewareAuthAdmin

router.post('/updateCountry', tour_classification.updateCountry); //middlewareAuthAdmin

router.post('/createProvince', tour_classification.createProvince); //middlewareAuthAdmin

router.post('/updateProvince', tour_classification.updateProvince); //middlewareAuthAdmin


module.exports = router