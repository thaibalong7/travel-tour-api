const db = require('../models');
const tour_turns = db.tour_turns;

exports.create = (req, res) => {
    tour_turns.create(req.body).then(_tour => {
        res.status(200).json(_tour)
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getByTour = (req, res) => {
    const idTour = req.params.idTour;
    const query = {
        where: {
            fk_tour: idTour
        },
        order: [['start_date', 'ASC']]
    }
    tour_turns.findAll(query).then(_tour_turns => {
        res.status(200).json({ data: _tour_turns })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}