const db = require('../models');
const types = db.types;

exports.create = (req, res) => {
    types.create(req.body).then(_type => {
        res.status(200).json(_type)
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAllType = (req, res) => {
    types.findAll().then(_types => {
        res.status(200).json({ result: _types })
    }).catch(err => {
        res.status(401).json({ msg: err })
    })
}