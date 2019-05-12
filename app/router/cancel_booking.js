var router = require('express').Router();
const cancel_booking = require('../controller/cancel_booking');
const { middlewareAuthUser } = require('../middleware/auth')

// create: { idBookTour, message} + token ở header
router.post('/requestCancel', middlewareAuthUser, cancel_booking.requestCancel);

router.get('/getAllProcessCancel', cancel_booking.getAllProcessCancel); //middlewareAuthAdmin

router.post('/confirmCancel', cancel_booking.confirmCancel) //middlewareAuthAdmin

router.post('/refunded', cancel_booking.refunded) //middlewareAuthAdmin

module.exports = router