const db = require('../models');
const routes = db.routes;
const helper_add_link = require('../helper/add_full_link');
const link_img = require('../config/setting').link_img;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const helper = require('../helper');

const asyncFor = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i);
    }
}
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
                },
                {
                    attributes: ['id', 'start_date'],
                    model: db.tour_turns,
                    where: {
                        status: 'public',
                        start_date: {
                            [Op.gt]: new Date()
                        }
                    }
                }],
            order: [[db.tour_turns, 'start_date', 'ASC']]
        }
        item.location.dataValues.tours = await db.tours.findAll(query);
        for (let i = 0; i < item.location.dataValues.tours.length; i++) {
            item.location.dataValues.tours[i].dataValues.tour_turns = item.location.dataValues.tours[i].dataValues.tour_turns[0];
        }
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
    //     idTransport,
    //     title
    // }
    try {
        if (typeof req.body.arrive_time !== 'undefined' && typeof req.body.leave_time !== 'undefined'
            && typeof req.body.day !== 'undefined' && typeof req.body.idLocation !== 'undefined'
            && typeof req.body.idTransport !== 'undefined' && typeof req.body.title !== 'undefined'
            && typeof req.body.detail !== 'undefined') {

            if (isNaN(req.body.day) || isNaN(req.body.idLocation) || isNaN(req.body.idTransport)) {
                return res.status(400).json({ msg: 'Param is invalid' })
            }
            else {
                const location = await db.locations.findByPk(req.body.idLocation);
                const transport = await db.transports.findByPk(req.body.idTransport);
                if (!location)
                    return res.status(400).json({ msg: 'Wrong location' })
                if (!transport)
                    return res.status(400).json({ msg: 'Wrong transport' })
                const new_routes = {
                    arrive_time: req.body.arrive_time,
                    leave_time: req.body.leave_time,
                    day: req.body.day,
                    fk_location: req.body.idLocation,
                    fk_transport: req.body.idTransport,
                    title: req.body.title,
                    detail: req.body.detail
                }
                routes.create(new_routes).then(async _route => {
                    const query = {
                        where: {
                            id: _route.id
                        },
                        attributes: { exclude: ['fk_location', 'fk_transport'] },
                        include: [{
                            model: db.locations,
                        },
                        {
                            model: db.transports
                        }]
                    }
                    let _route_result = await routes.findOne(query)
                    if (_route_result.location.featured_img !== null) {
                        if (process.env.NODE_ENV === 'development')
                            _route_result.location.featured_img = 'http://' + req.headers.host + link_img.link_location_featured + _route_result.location.featured_img;
                        else
                            _route_result.location.featured_img = 'https://' + req.headers.host + link_img.link_location_featured + _route_result.location.featured_img;
                    }
                    return res.status(200).json(_route_result);
                }).catch(err => {
                    return res.status(400).json({ msg: err })
                })
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e.toString() })
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
                const query = {
                    where: {
                        id: req.body.id
                    },
                    include: [{
                        model: db.locations,
                    },
                    {
                        model: db.transports
                    }]
                }
                const _route = await routes.findOne(query);
                if (_route) {
                    if (typeof req.body.arrive_time !== 'undefined')
                        _route.arrive_time = req.body.arrive_time;
                    if (typeof req.body.leave_time !== 'undefined')
                        _route.leave_time = req.body.leave_time;
                    if (typeof req.body.title !== 'undefined')
                        _route.title = req.body.title;
                    if (typeof req.body.detail !== 'undefined')
                        _route.detail = req.body.detail;
                    if (typeof req.body.day !== 'undefined' && !isNaN(req.body.day))
                        _route.day = req.body.day
                    if (typeof req.body.idLocation !== 'undefined' && !isNaN(req.body.idLocation)) {
                        const check_location = await db.locations.findByPk(req.body.idLocation)
                        if (check_location) {
                            _route.fk_location = req.body.idLocation;
                            _route.dataValues.location = check_location;
                        }
                    }
                    if (typeof req.body.idTransport !== 'undefined' && !isNaN(req.body.idTransport)) {
                        const check_transport = await db.transports.findByPk(req.body.idTransport)
                        if (check_transport) {
                            _route.fk_transport = req.body.idTransport;
                            _route.dataValues.transport = check_transport;
                        }
                    }
                    await _route.save();
                    if (_route.location.featured_img !== null) {
                        if (process.env.NODE_ENV === 'development')
                            _route.dataValues.location.featured_img = 'http://' + req.headers.host + link_img.link_location_featured + _route.location.featured_img;
                        else
                            _route.dataValues.location.featured_img = 'https://' + req.headers.host + link_img.link_location_featured + _route.location.featured_img;
                    }
                    return res.status(200).json({
                        msg: 'Update successful',
                        data: _route
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
        res.status(400).json({ msg: e.toString() })
    }

}

exports.getByTour = (req, res) => {
    const idTour = req.params.idTour;
    const vesion2 = (req.query._vs == 2);
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
            },
            {
                model: db.provinces
            }]
        },
        {
            model: db.transports
        }],
        order: [['day', 'ASC'], ['arrive_time', 'ASC']]
    }
    routes.findAll(query).then(async _routes => {
        const result = await addLinkLocationFeaturedImgOfListRoutesAndAddTour(_routes, req.headers.host)
        Promise.all(result).then(async completed => {
            res.status(200).json({
                data: vesion2 == true ? await helper.convertListRoutes(completed) : completed,
            })
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAll = (req, res) => {
    const query = {
        attributes: { exclude: ['fk_location', 'fk_transport'] },
        include: [{
            model: db.locations,
            // attributes: { exclude: ['fk_type'] },
            // include: [{
            //     model: db.types
            // }]
        },
        {
            model: db.transports
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

exports.getAllNotHaveTour = (req, res) => {
    const query = {
        where: {
            fk_tour: null
        },
        attributes: { exclude: ['fk_location', 'fk_transport'] },
        include: [{
            model: db.locations,
            // attributes: { exclude: ['fk_type'] },
            // include: [{
            //     model: db.types
            // }]
        },
        {
            model: db.transports
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
        attributes: { exclude: ['fk_location', 'fk_transport'] },
        include: [{
            model: db.locations,
            // attributes: { exclude: ['fk_type'] },
            // include: [{
            //     model: db.types
            // }]
        },
        {
            model: db.transports
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
        console.error(err);
        res.status(400).json({ msg: err.toString() })
    })
}

exports.getCurrentRoute = async (req, res) => {
    try {
        const idTourTurn = req.body.id;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var distance = req.body.distance;
        var limitDelay_min = req.body.limitDelay_min;
        var limitDelay_hour = req.body.limitDelay_hour;
        const limitDelay_min_default = 0;
        const limitDelay_hour_default = 1; //mặc định giới hạn thời gian delay hoặc xuất phát sớm là 1h
        const distance_default = 0.1; //100 m
        if (typeof lat === 'undefined' ||
            typeof lng === 'undefined' ||
            isNaN(lat) || isNaN(lng) ||
            (typeof distance !== 'undefined' && isNaN(distance)) ||
            (typeof limitDelay_min !== 'undefined' && isNaN(limitDelay_min)) ||
            (typeof limitDelay_hour !== 'undefined' && isNaN(limitDelay_hour))) {
            return res.status(400).json({ msg: "Params is invalid" })
        }
        const check_tour_turn = await db.tour_turns.findByPk(idTourTurn);
        if (check_tour_turn) {
            const curTime = new Date(req.body.cur_time);
            if (typeof distance === 'undefined') distance = distance_default;
            if (typeof limitDelay_min === 'undefined') limitDelay_min = limitDelay_min_default;
            if (typeof limitDelay_hour === 'undefined') limitDelay_hour = limitDelay_hour_default;
            lat = parseFloat(lat);
            lng = parseFloat(lng);
            distance = parseFloat(distance);
            limitDelay_min = parseInt(limitDelay_min);
            limitDelay_hour = parseInt(limitDelay_hour);
            const start_date = new Date(check_tour_turn.start_date + ':00:00:00');
            const end_date = new Date(check_tour_turn.end_date + ':00:00:00');
            end_date.setTime(end_date.getTime() + 86400000);
            if (curTime < start_date && curTime < end_date) {
                return res.status(400).json({ msg: "Tour not yet started" })
            }
            if (curTime > start_date && curTime > end_date) {
                return res.status(400).json({ msg: "Tour has ended" })
            }
            var query = {
                where: {
                    fk_tour: check_tour_turn.fk_tour
                },
                attributes: { exclude: ['fk_location'] },
                include: [{
                    model: db.locations,
                    attributes: {
                        include: [
                            [Sequelize.literal(`6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(${lng}) - radians(longitude)) + sin(radians(${lat})) * sin(radians(latitude)))`), 'distince']
                        ]
                    },
                }],
                order: [['day', 'ASC'], ['arrive_time', 'ASC']]
            }
            function sortRoutesByDistance(route1, route2) {
                return route1.location.dataValues.distince - route2.location.dataValues.distince;
            }
            const milliseconds_limitDelay = 1000 * 60 * limitDelay_min + 1000 * 60 * 60 * limitDelay_hour; //giới hạn delay tính theo millisecond
            routes.findAll(query).then(async (_routes) => {
                const result = [];
                await asyncFor(_routes, (route, index) => {
                    // console.log(parseFloat(route.location.dataValues.distince))
                    if (parseFloat(route.location.dataValues.distince) <= distance) {
                        //check time
                        // var time = '12:30:00',
                        //     hours = time.split(':')[0],
                        //     minutes = time.split(':')[1],

                        const milliseconds_add_day = (route.day - 1) * 86400000; //86400000 is millisecond of 1 day

                        let arrive_time_limit = new Date(start_date.getTime() + milliseconds_add_day);
                        let leave_time_limit = new Date(start_date.getTime() + milliseconds_add_day);
                        if (index !== _routes.length - 1 && route.day < _routes[index + 1].day) {
                            //route kế tiếp là ngày kế tiếp
                            leave_time_limit.setTime(leave_time_limit.getTime() + (_routes[index + 1].day - route.day) * 86400000)
                        }
                        if (index !== 0) //đang xét route không phải route đầu
                            arrive_time_limit.setHours(route.arrive_time.split(':')[0], route.arrive_time.split(':')[1]);
                        else { //đang xét route đầu
                            if (route.arrive_time !== null) //route đầu có arrive k phải null -> lấy time bình thường
                                arrive_time_limit.setHours(route.arrive_time.split(':')[0], route.arrive_time.split(':')[1]);
                            else //ngược lại -> lấy time bằng start date của tour turn
                                arrive_time_limit.setTime(start_date.getTime() + milliseconds_limitDelay);
                        }
                        if (index !== _routes.length - 1) //đang xét route không phải route cuối
                            leave_time_limit.setHours(route.leave_time.split(':')[0], route.leave_time.split(':')[1]);
                        else { //đang xet route cuối
                            if (route.leave_time !== null) //route cuối có leave k phải null => lấy time bình thường
                                leave_time_limit.setHours(route.leave_time.split(':')[0], route.leave_time.split(':')[1]);
                            else //ngược lại -> lấy time bằng end_time
                                leave_time_limit.setTime(end_date.getTime() - milliseconds_limitDelay);

                        }
                        arrive_time_limit.setTime(arrive_time_limit.getTime() - milliseconds_limitDelay);
                        leave_time_limit.setTime(leave_time_limit.getTime() + milliseconds_limitDelay);
                        // console.log(curTime.toString(), arrive_time_limit.toString(), leave_time_limit.toString());
                        if (curTime >= arrive_time_limit && curTime <= leave_time_limit) {
                            route.dataValues.arrive_time_limit = arrive_time_limit;
                            route.dataValues.leave_time_limit = leave_time_limit;
                            result.push(route)
                            return;
                        }
                        return;
                    }
                    return;
                })
                if (result.length === 0) {
                    return res.status(200).json({
                        data: null,
                    })
                }
                else {
                    //sort theo khoảng cách
                    result.sort(sortRoutesByDistance);
                    if (result[0].location.featured_img !== null) {
                        if (process.env.NODE_ENV === 'development')
                            result[0].location.featured_img = 'http://' + req.headers.host + link_img.link_location_featured + result[0].location.featured_img;
                        else
                            result[0].location.featured_img = 'https://' + req.headers.host + link_img.link_location_featured + result[0].location.featured_img;
                    }
                    return res.status(200).json({
                        data: result[0],
                    })
                }
            })
        }
        else {
            return res.status(400).json({ msg: "Wrong id tour turn" })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}
