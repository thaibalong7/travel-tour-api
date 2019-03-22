const db = require('../models')
const type_passenger = db.type_passenger;

exports.create = (req, res) => {
    if (typeof req.body.name !== 'undefined') {
        type_passenger.create({ name: req.body.name }).then(_type => {
            res.status(200).json(_type)
        }).catch(err => {
            res.status(400).json({ msg: err })
        })
    } else {
        res.status(400).json({ msg: 'Param is invalid' })
    }
}

exports.update = (req, res) => {
    type_passenger.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then(async type => {
        res.status(200).json({
            msg: 'Update successfull',
            data: await type_passenger.findByPk(req.body.id)
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAll = (req, res) => {
    try {
        type_passenger.findAll().then(_types => {
            res.status(200).json({ data: _types })
        }).catch(err => {
            res.status(400).json({ msg: err })
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}   