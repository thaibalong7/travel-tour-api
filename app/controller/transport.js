const db = require('../models');
const transports = db.transports;

exports.getAll = (req, res) => {
    transports.findAll().then(_transports => {
        res.status(200).json({ data: _transports })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.create = (req, res) => {
    // {
    //     name_en,
    //     name_vn
    // }
    try {
        if (typeof req.body.name_vn !== 'undefined' && typeof req.body.name_en !== 'undefined') {
            const new_transport = {
                name_en: req.body.name_en,
                name_vn: req.body.name_vn
            }
            transports.create(new_transport).then(_transport => {
                return res.status(200).json(_transport);
            }).catch(e => {
                return res.status(400).json({ msg: e })
            })
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}

exports.update = async (req, res) => {
    // {
    //     id,
    //     name_en,
    //     name_vn
    // }
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _transport = await transports.findByPk(req.body.id)
            if (_transport) {
                if (typeof req.body.name_en !== 'undefined') {
                    _transport.name_en = req.body.name_en
                }
                if (typeof req.body.name_vn !== 'undefined') {
                    _transport.name_vn = req.body.name_vn
                }
                await _transport.save();
                return res.status(200).json({
                    msg: 'Update successful',
                    data: _transport
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id' })
            }
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}

exports.getById = async (req, res) => {
    try {
        if (typeof req.params.id === 'undefined' || isNaN(req.params.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _transport = await transports.findByPk(req.params.id)
            return res.status(200).json({
                data: _transport
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}