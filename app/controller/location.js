const db = require('../models');
const locations = db.locations;

exports.create = (req, res) => {
    locations.create(req.body).then(_location => {
        res.status(200).json(_location)
    }).catch(err => {
        res.status(400).json({ msg: err })
    })

}

exports.getAllLocation = (req, res) => {
    locations.findAll().then(_locations => {
        res.status(200).json({ result: _locations })
    }).catch(err => {
        res.status(401).json({ msg: err })
    })
}

exports.getById = (req, res) => {
    const query = {
        where: { id: req.params.id },
        include:[{
            model: db.types
        }]
    }
    locations.findOne(query).then(_location => {
        res.status(200).json({ result: _location })
    }).catch(err => {
        res.status(400).json({ msg: err });
    })
}

exports.test = (req, res) => {
    res.status(200).json({ msg: 'test thành cmn công' })
}