var router = require('express').Router();
const book_tour = require('../controller/book_tour');

router.post('/book_new_tour', book_tour.book_tour);

module.exports = router;