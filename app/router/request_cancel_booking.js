var router = require('express').Router();
const request_cancel_booking = require('../controller/request_cancel_booking');
const { middlewareAuthUser } = require('../middleware/auth')

router.post('/create', middlewareAuthUser, request_cancel_booking.create);

module.exports = router