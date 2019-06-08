var router = require('express').Router();
const db = require('../models');
const request = require('request');

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
router.use('/cancel_booking', require('./cancel_booking'));
router.use('/tour_classification', require('./tour_classification'));
router.use('/roles_admin', require('./roles_admin'));

router.get('/getNumOfTourAndLocation', async (req, res) => {
    const all_tours = await db.tours.findAll();
    const all_locations = await db.locations.findAll();
    res.status(200).json({
        num_of_tours: all_tours.length,
        num_of_locations: all_locations.length
    })
})

router.post('/verifyCaptcha', (req, res) => {
    if (
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.json({ "success": false, "msg": "Please select captcha" });
    }

    // Secret Key
    const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    // Make Request To VerifyURL
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);
        console.log(body);

        // If Not Successful
        if (body.success !== undefined && !body.success) {
            return res.json({ "success": false, "msg": "Failed captcha verification" });
        }

        //If Successful
        return res.json({ "success": true, "msg": "Captcha passed" });
    });
});

module.exports = router