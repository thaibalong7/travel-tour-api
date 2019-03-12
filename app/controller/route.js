const db = require('../models');
const routes = db.routes;
const helper_add_link = require('../helper/add_full_link');
const link_img = require('../config/config').link_img;

const addLinkLocationFeaturedImgOfListRoutesAndAddTour = async (_routes, host) => {
    return _routes.map(async item => {
        const query = {
            attributes: ['id', 'name'],
            include: [
                {
                    attributes: [],
                    model: db.routes,
                    where: {
                        fk_location: item.location.id
                    }
                }]
        }
        item.location.dataValues.tours = await db.tours.findAll(query);
        if (item.location.featured_img === null) {
            // location.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
        }
        else {
            if (process.env.NODE_ENV === 'development')
                item.location.featured_img = 'http://' + host + link_img.link_location_featured + item.location.featured_img;
            else
                item.location.featured_img = 'https://' + host + link_img.link_location_featured + item.location.featured_img;
        }
        return item;
    })
}

exports.create = async (req, res) => {
    // {
    //     arrive_time,
    //     leave_time,
    //     day,
    //     idLocation,
    //     idTour,
    //     idTransport
    // }
    try {
        if (typeof req.body.arrive_time !== 'undefined' && typeof req.body.leave_time !== 'undefined'
            && typeof req.body.day !== 'undefined' && typeof req.body.idLocation !== 'undefined'
            && typeof req.body.idTour !== 'undefined' && typeof req.body.idTransport !== 'undefined') {

            if (isNaN(req.body.day) || isNaN(req.body.idLocation) || isNaN(req.body.idTour) || isNaN(req.body.idTransport)) {
                return res.status(400).json({ msg: 'Param is invalid' })
            }
            else {
                const new_routes = {
                    arrive_time: req.body.arrive_time,
                    leave_time: req.body.leave_time,
                    day: req.body.day,
                    fk_location: req.body.idLocation,
                    fk_tour: req.body.idTour,
                    fk_transport: req.body.idTransport
                }
                const location = await db.locations.findByPk(new_routes.idLocation);
                const tour = await db.locations.findByPk(new_routes.idTour);
                const transport = await db.locations.findByPk(new_routes.idTransport);
                if (location === null)
                    return res.status(400).json({ msg: 'Wrong location' })
                if (tour === null)
                    return res.status(400).json({ msg: 'Wrong tour' })
                if (transport === null)
                    return res.status(400).json({ msg: 'Wrong transport' })
                routes.create(new_routes).then(_route => {
                    res.status(200).json(_route)
                }).catch(err => {
                    res.status(400).json({ msg: err })
                })
            }
        }
        else {
            res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (e) {
        res.status(400).json({ msg: e })
    }
}

exports.update = async (req, res) => {
    // fk_tour sẽ k được cho phép update
    // {
    //     id
    //     arrive_time,
    //     leave_time,
    //     day,
    //     title,
    //     idLocation,
    //     idTransport
    // }
    try {
        if (typeof req.body.id !== 'undefined') {
            if (!isNaN(req.body.id)) {
                const _route = await routes.findByPk(req.body.id);
                if (_route) {
                    if (typeof req.body.arrive_time !== 'undefined')
                        _route.arrive_time = req.body.arrive_time;
                    if (typeof req.body.leave_time !== 'undefined')
                        _route.leave_time = req.body.leave_time;
                    if (typeof req.body.title !== 'undefined')
                        _route.title = req.body.title;
                    if (typeof req.body.day !== 'undefined' && !isNaN(req.body.day))
                        _route.day = req.body.day
                    if (typeof req.body.idLocation !== 'undefined' && !isNaN(req.body.idLocation)) {
                        const check_location = db.locations.findByPk(req.body.idLocation)
                        if (check_location)
                            _route.fk_location = req.body.idLocation;
                    }
                    if (typeof req.body.idTransport !== 'undefined' && !isNaN(req.body.idTransport)) {
                        const check_transport = db.locations.findByPk(req.body.idTransport)
                        if (check_transport)
                            _route.fk_transport = req.body.idTransport;
                    }
                    await _route.save();
                    return res.status(200).json({
                        msg: 'Update successful'
                    })
                }
                else {
                    return res.status(400).json({ msg: 'Wrong id route' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Param is invalid' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (e) {
        res.status(400).json({ msg: e })
    }

}

exports.getByTour = (req, res) => {
    const idTour = req.params.idTour;
    if (typeof idTour === 'undefined' || isNaN(idTour))
        return res.status(400).json({ msg: 'Param is invalid' })
    const query = {
        attributes: { exclude: ['fk_tour', 'fk_transport', 'fk_location'] },
        where: { fk_tour: idTour },
        include: [{
            model: db.locations,
            attributes: { exclude: ['fk_type'] },
            include: [{
                model: db.types
            }]
        },
        {
            model: db.transports
        }],
        order: [['day', 'ASC'], ['arrive_time', 'ASC']]
    }
    routes.findAll(query).then(async _routes => {
        const result = await addLinkLocationFeaturedImgOfListRoutesAndAddTour(_routes, req.headers.host)
        Promise.all(result).then(completed => {
            res.status(200).json({
                data: completed,
            })
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAll = (req, res) => {
    const query = {
        attributes: { exclude: ['fk_location'] },
        include: [{
            model: db.locations,
            // attributes: { exclude: ['fk_type'] },
            // include: [{
            //     model: db.types
            // }]
        }],
        order: [['fk_tour', 'ASC'], ['day', 'ASC'], ['arrive_time', 'ASC']]
    }
    routes.findAll(query).then(async _routes => {
        await helper_add_link.addLinkLocationFeaturedImgOfListRoutes(_routes, req.headers.host);
        res.status(200).json({
            data: _routes,
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getById = (req, res) => {
    const id = req.params.id;
    if (typeof id === 'undefined' || isNaN(id))
        return res.status(400).json({ msg: 'Param is invalid' })

    const query = {
        where: {
            id: id
        },
        attributes: { exclude: ['fk_location'] },
        include: [{
            model: db.locations,
            // attributes: { exclude: ['fk_type'] },
            // include: [{
            //     model: db.types
            // }]
        }]
    }
    routes.findOne(query).then(async _route => {
        if (_route !== null) {
            if (_route.dataValues.location.dataValues.featured_img === null) {

            }
            else {
                if (process.env.NODE_ENV === 'development')
                    _route.dataValues.location.dataValues.featured_img = 'http://' + req.headers.host + link_img.link_location_featured + _route.dataValues.location.dataValues.featured_img;
                else
                    _route.dataValues.location.dataValues.featured_img = 'https://' + req.headers.host + link_img.link_location_featured + _route.dataValues.location.dataValues.featured_img;
            }
        }
        res.status(200).json({
            data: _route,
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}
