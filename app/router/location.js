var router = require('express').Router();
const locations = require('../controller/location');

// example call api: http://localhost:5000/location/getAll?per_page=10&page=2&tour=false
router.get('/getAll', locations.getAllLocation);

router.get('/getAllWithoutPagination', locations.getAllWithoutPagination);

router.post('/create', locations.create); //viết tạm, chưa thống nhất luồng sử lý

router.get('/getById/:id', locations.getById);

// example call api: http://localhost:5000/location/getByTypeNearMe?&tour=false
router.post('/getNearMe', locations.getLocationNearMe) //req.body.lat .lng .distance

router.get('/getByType/:typeId', locations.getLocationByType)

// example call api: http://localhost:5000/location/getByTypeNearMe?&tour=false
router.post('/getByTypeNearMe', locations.getByTypeNearMe) //req.body.lat .lng .distance .type

module.exports = router