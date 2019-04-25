var router = require('express').Router();
const request_cancel_booking = require('../controller/request_cancel_booking');
const { middlewareAuthUser } = require('../middleware/auth')

// create: { idBookTour, message} + token ở header
router.post('/create', middlewareAuthUser, request_cancel_booking.create);

router.get('/getAllRequest', request_cancel_booking.getAllRequests);

module.exports = router