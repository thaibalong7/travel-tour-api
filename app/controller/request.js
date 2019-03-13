const db = require('../models');
const requests = db.requests;

exports.create = (req, res) => {
    try {
        if (typeof req.body.name === 'undefined' || typeof req.body.email === 'undefined'
            || typeof req.body.message === 'undefined')
            return res.status(400).json({ msg: 'Param is invalid' })
        else {
            const new_request = {
                name: req.body.name,
                email: req.body.email,
                message: req.body.message
            }
            requests.create(new_request).then(_request => {
                res.status(200).json(_request);
            }).catch(err => {
                return res.status(400).json({ msg: 'Error when create in DB' })
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}