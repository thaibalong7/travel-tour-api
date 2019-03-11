const db = require('../models');
const tour_turns = db.tour_turns;

exports.create = async (req, res) => {
    // {
    //     start_date,
    //     end_date,
    //     num_max_people,
    //     discount,
    //     idTour,
    //     price
    // }
    try {
        if (typeof req.body.num_max_people !== 'undefined' || typeof req.body.discount !== 'undefined'
            || typeof req.body.start_date !== 'undefined' || typeof req.body.end_date !== 'undefined'
            || typeof req.body.idTour !== 'undefined' || typeof req.body.price !== 'undefined') {
            if (isNaN(req.body.num_max_people) || isNaN(req.body.discount) || isNaN(req.body.price)) {
                return res.status(400).json({ msg: 'Params is invalid' })
            }
            const new_tour_turn = {
                fk_tour: req.body.idTour,
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                num_max_people: parseInt(req.body.num_max_people),
                discount: parseFloat(req.body.discount),
                price: parseInt(req.body.price)
            }
            if (new_tour_turn.start_date > new_tour_turn.end_date) {
                return res.status(400).json({ msg: 'Start time must be less than the end time' })
            }
            else {
                if (await db.tours.findByPk(new_tour_turn.fk_tour) === null) {
                    return res.status(400).json({ msg: 'Wrong tour id' })
                }
                else {
                    tour_turns.create(new_tour_turn).then(_tour => {
                        return res.status(200).json(_tour)
                    }).catch(err => {
                        return res.status(400).json({ msg: 'Error when create in DB' })
                    })
                }
            }
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' })
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
        attributes: { exclude: ['fk_tour'] },
        where: {
            id: id
        },
        include: [{
            attributes: ['id', 'name'],
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
        attributes: { exclude: ['fk_tour'] },
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

exports.update = async (req, res) => {
    // {
    //     id,
    //     start_date,
    //     end_date,
    //     num_max_people,
    //     discount,
    //     price
    // }
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _tour_turn = await tour_turns.findByPk(req.body.id);
            if (!_tour_turn) {
                //k tồn tại id này
                return res.status(400).json({ msg: 'Wrong id' })
            }
            if (new Date() >= new Date(_tour_turn.start_date)) //ngày hiện tại lớn hơn ngày đi - tức tour đang hoặc đã đi
            {
                return res.status(400).json({ msg: 'Can not update this turn' })
            }
            if (typeof req.body.num_max_people !== 'undefined' || !isNaN(req.body.num_max_people)) { //num_max_people là hợp lệ
                if (parseInt(req.body.num_max_people) < parseInt(_tour_turn.num_current_people)) { //num_max_people phải lớn hơn num_current_people
                    return res.status(400).json({ msg: 'Wrong max people' })
                }
                else {
                    _tour_turn.num_max_people = parseInt(req.body.num_max_people);
                }
            }
            if (typeof req.body.discount !== 'undefined' || !isNaN(req.body.discount)) {
                _tour_turn.discount = parseFloat(req.body.discount);
            }
            if (typeof req.body.price !== 'undefined' || !isNaN(req.body.price)) {
                _tour_turn.price = parseFloat(req.body.price);
            }
            if (typeof req.body.start_date !== 'undefined') { //có start_date
                if (typeof req.body.end_date !== 'undefined') // có end_date
                    if (new Date(req.body.start_date) < new Date(req.body.end_date) && new Date(req.body.start_date) > new Date()) {
                        //thỏa mọi điều kiện
                        _tour_turn.start_date = req.body.start_date;
                        _tour_turn.end_date = req.body.end_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                else {
                    //có start nhưng k có end_date
                    if (new Date(req.body.start_date) > new Date() && new Date(req.body.start_date) < new Date(_tour_turn.end_date)) {
                        //thỏa start date là ngày ở tương lai, và nhỏ hơn end date đã có
                        _tour_turn.start_date = req.body.start_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                }
            }
            else {
                //k có start date
                if (typeof req.body.end_date !== 'undefined') // có end_date
                {
                    if (new Date(_tour_turn.start_date) < new Date(req.body.end_date)) {
                        //thỏa end_date là sau start_date đang có
                        _tour_turn.end_date = req.body.end_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                }
            }
            await _tour_turn.save();
            return res.status(200).json({
                msg: 'Update successful',
                profile: _tour_turn
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}