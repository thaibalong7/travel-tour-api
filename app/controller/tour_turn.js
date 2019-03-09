const db = require('../models');
const tour_turns = db.tour_turns;

exports.create = (req, res) => {
    try {
        if (isNaN(req.body.num_max_people) || isNaN(req.body.discount)) {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
        const new_tour_turn = {
            fk_tour: req.body.idTour,
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
            num_max_people: parseInt(req.body.num_max_people),
            discount: parseFloat(req.body.discount)
        }
        if (new_tour_turn.start_date > new_tour_turn.end_date) {
            return res.status(400).json({ msg: 'Start time must be less than the end time' })
        }
        else {
            tour_turns.create(new_tour_turn).then(_tour => {
                return res.status(200).json(_tour)
            }).catch(err => {
                return res.status(400).json({ msg: 'Error when create in DB' })
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: 'Error' })
    }
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