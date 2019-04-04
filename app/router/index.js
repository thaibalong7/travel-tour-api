var router = require('express').Router();
const db = require('../models');

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/location', require('./location'));
router.use('/type', require('./type'));
router.use('/tour', require('./tour'));
router.use('/route', require('./route'))
router.use('/tour_turn', require('./tour_turn'));
router.use('/reviews', require('./reviews'));
router.use('/transport', require('./transport'));
router.use('/request', require('./request'));
router.use('/tour_image', require('./tour_image'));
router.use('/book_tour', require('./book_tour'));
router.use('/type_passenger', require('./type_passenger'));
router.use('/payment_method', require('./payment_method'));
router.use('/request_cancel_booking', require('./request_cancel_booking'));

router.get('/getNumOfTourAndLocation', async (req, res) => {
    const all_tours = await db.tours.findAll();
    const all_locations = await db.locations.findAll();
    res.status(200).json({
        num_of_tours: all_tours.length,
        num_of_locations: all_locations.length
    })
})

module.exports = router