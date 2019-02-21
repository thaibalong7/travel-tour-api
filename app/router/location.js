var router = require('express').Router();
const locations = require('../controller/location');

// example call api: http://localhost:5000/location/getAll?per_page=10&page=2
router.get('/getAll', locations.getAllLocation);

router.post('/create', locations.create);

router.get('/getById/:id', locations.getById);

router.post('/getLocationNearMe', locations.getLocationNearMe)

router.get('/test', locations.test);

module.exports = router