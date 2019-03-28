const db = require('../models')
const payment_method = db.payment_method;

exports.create = (req, res) => {
    if (typeof req.body.name !== 'undefined') {
        payment_method.create({ name: req.body.name }).then(_payment => {
            res.status(200).json(_payment)
        }).catch(err => {
            res.status(400).json({ msg: err })
        })
    } else {
        res.status(400).json({ msg: 'Param is invalid' })
    }
}

exports.update = (req, res) => {
    payment_method.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then(async payment => {
        res.status(200).json({
            msg: 'Update successful',
            data: await payment_method.findByPk(req.body.id)
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAll = (req, res) => {
    try {
        payment_method.findAll().then(_payments => {
            res.status(200).json({ data: _payments })
        }).catch(err => {
            res.status(400).json({ msg: err })
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() });
    }
}   