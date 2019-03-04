var router = require('express').Router();
const comments = require('../controller/comment');

router.post('/create', comments.create);

module.exports = router