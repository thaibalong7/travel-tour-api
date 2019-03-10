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
    if (typeof idTour === 'undefined' || isNaN(id)) {
        return res.status(400).json({ msg: 'Param is invalid' })
    }
    const query = {
        where: {
            fk_tour: idTour
        },
        order: [['start_date', 'DESC']]
    }
    tour_turns.findAll(query).then(_tour_turns => {
        res.status(200).json({ data: _tour_turns })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getById = (req, res) => {
    const id = req.params.id;
    if (typeof id === 'undefined' || isNaN(id)) {
        return res.status(400).json({ msg: 'Param is invalid' })
    }
    const query = {
        where: {
            id: id
        },
        include: [{
            model: db.tours
        }]
    }
    tour_turns.findOne(query).then(_tour_turns => {
        if (_tour_turns !== null) {
            if (_tour_turns.tour.featured_img !== null) {
                if (process.env.NODE_ENV === 'development')
                    _tour_turns.tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + _tour_turns.tour.featured_img
                else
                    _tour_turns.tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + _tour_turns.tour.featured_img
            }
        }
        res.status(200).json({ data: _tour_turns })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAllWithoutPagination = (req, res) => {
    const query = {
        include: [{
            attributes: ['id', 'name', 'price'],
            model: db.tours
        }],
        order: [['start_date', 'DESC']]
    }
    tour_turns.findAll(query).then(_tour_turns => {
        res.status(200).json({
            itemCount: _tour_turns.length, //số lượng record được trả về
            data: _tour_turns
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}