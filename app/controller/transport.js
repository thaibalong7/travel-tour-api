const db = require('../models');
const transports = db.transports;

exports.getAll = (req, res) => {
    transports.findAll().then(_transports => {
        res.status(200).json({ data: _transports })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}