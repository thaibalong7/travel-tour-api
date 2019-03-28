var router = require('express').Router();
const book_tour = require('../controller/book_tour');
const { middlewareAuthUser } = require('../middleware/auth')
router.post('/book_new_tour', book_tour.book_tour);

router.get('/getHistoryBookTourByUser', middlewareAuthUser, book_tour.getHistoryBookTourByUser);

//example call api: http://localhost:5000/book_tour/getHistoryBookTourById/7?tour=true
router.get('/getHistoryBookTourById/:id', book_tour.getHistoryBookTourById);

//example call api: http://localhost:5000/book_tour/getHistoryBookTourByCode/8fae3160-5059-11e9-98a6-11c33d1f98b4?tour=true
router.get('/getHistoryBookTourByCode/:code', book_tour.getHistoryBookTourByCode);

router.get('/getPassengerInBookTourHistory/:id', book_tour.getPassengerInBookTourHistory)

//example call api: http://localhost:5000/book_tour/getAllBookTourHistoryWithoutPagination?status=has_departed
//có 03 loại status: not_yet_started (chưa đi), has_departed (đang đi), finished (đã đi)
router.get('/getAllBookTourHistoryWithoutPagination', book_tour.getAllBookTourHistoryWithoutPagination)

module.exports = router;