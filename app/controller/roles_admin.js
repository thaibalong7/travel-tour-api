const db = require('../models');
const roles_admin = db.roles_admin;

exports.getAll = (req, res) => {
    roles_admin.findAll().then(_roles_admin => {
        res.status(200).json({ data: _roles_admin })
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
        if (typeof req.body.name !== 'undefined') {
            const new_roles_admin = {
                name: req.body.name,
            }
            roles_admin.create(new_roles_admin).then(_roles_admin => {
                return res.status(200).json(_roles_admin);
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
            const _roles_admin = await roles_admin.findByPk(req.body.id)
            if (_roles_admin) {
                if (typeof req.body.name !== 'undefined') {
                    _roles_admin.name = req.body.name
                }

                await _roles_admin.save();
                return res.status(200).json({
                    msg: 'Update successful',
                    data: _roles_admin
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
            const _roles_admin = await roles_admin.findByPk(req.params.id)
            return res.status(200).json({
                data: _roles_admin
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}