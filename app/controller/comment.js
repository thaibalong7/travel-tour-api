const db = require('../models');
const comments = db.comments;

exports.create = (req, res) => {
    try {
        var comment;
        comment.content = req.body.content;
        comment.fk_tour = req.body.idTour;
        comment.fk_user = req.userData.id;
        comments.create(comment).then(_comment => {
            res.status(200).json(_comment)
        })
    }
    catch (err) {
        res.status(400).json({ msg: err })
    }
}