var router = require('express').Router();
const book_tour = require('../controller/book_tour');
const { middlewareAuthUser } = require('../middleware/auth')
router.post('/book_new_tour', book_tour.book_tour);

router.get('/getHistoryBookTourByUser', middlewareAuthUser, book_tour.getHistoryBookTourByUser);

//example call api: http://localhost:5000/book_tour/getHistoryBookTourById/7?tour=true
router.get('/getHistoryBookTourById/:id', book_tour.getHistoryBookTourById);

module.exports = router;