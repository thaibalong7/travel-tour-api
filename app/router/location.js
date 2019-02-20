var router = require('express').Router();
const locations = require('../controller/location');

router.get('/getAllLocation', locations.getAllLocation);
router.post('/create', locations.create);
router.get('/test', locations.test);
router.get('/getById/:id', locations.getById);

module.exports = router