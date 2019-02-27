const db = require('../models');
const routes = db.routes;

exports.create = (req, res) => {
    routes.create(req.body).then(_tour => {
        res.status(200).json(_tour)
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getByTour = (req, res) => {
    const idTour = req.params.idTour;
    const query = {
        where: { fk_tour: idTour },
        include: [{
            model: db.locations,
            include: [{
                model: db.types
            }]
        }],
        order: [['day', 'ASC'], ['arrive_time', 'ASC']]
    }
    routes.findAll(query).then(_routes => {
        res.status(200).json({ data: _routes })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}
