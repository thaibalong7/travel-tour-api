var router = require('express').Router();
const comments = require('../controller/comment');
const { middlewareAuthUser } = require('../middleware/auth')

router.post('/create', middlewareAuthUser, comments.create);

router.get('/getByTour/:idTour', comments.getByTour);

module.exports = router