const db = require('../models');
const locations = db.locations;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const helper_add_link = require('../helper/add_full_link');
const link_img = require('../config/setting').link_img
const fs = require('fs');

const addLinkLocationFeaturedImgOfListLocationsAndAddTour = async (_locations, host) => {
    return _locations.map(async item => {
        const query = {
            attributes: ['id', 'name', 'featured_img'],
            include: [
                {
                    attributes: [],
                    model: db.routes,
                    where: {
                        fk_location: item.id
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
        item.dataValues.tours = await db.tours.findAll(query);
        for (let i = 0; i < item.dataValues.tours.length; i++) {
            item.dataValues.tours[i].dataValues.tour_turns = item.dataValues.tours[i].dataValues.tour_turns[0];
        }
        await helper_add_link.addLinkToursFeaturedImgOfListTours(item.dataValues.tours, host);
        if (item.featured_img === null) {
            // location.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
        }
        else {
            if (process.env.NODE_ENV === 'development')
                item.featured_img = 'http://' + host + link_img.link_location_featured + item.featured_img;
            else
                item.featured_img = 'https://' + host + link_img.link_location_featured + item.featured_img;
        }
        return item;
    })
}

const arr_status = ['active', 'inactive']

exports.create = async (req, res) => {
    try {
        if (typeof req.body.latitude !== 'undefined' && typeof req.body.longitude !== 'undefined'
            && typeof req.body.name !== 'undefined' && typeof req.body.address !== 'undefined'
            && typeof req.body.description !== 'undefined' && typeof req.body.fk_type !== 'undefined'
            && typeof req.body.fk_province !== 'undefined') {
            if (typeof req.file !== 'undefined') {
                if (!isNaN(req.body.latitude) && !isNaN(req.body.longitude)) {
                    if (!isNaN(req.body.fk_type) && !isNaN(req.body.fk_province)) {
                        const check_type = await db.types.findByPk(parseInt(req.body.fk_type));
                        const check_province = await db.provinces.findByPk(parseInt(req.body.fk_province));
                        if (check_type && check_province) {
                            var date = new Date();
                            var timestamp = date.getTime();
                            fs.writeFile('public/assets/images/locationFeatured/' + timestamp + '.jpg', req.file.buffer, async (err) => {
                                if (err) {
                                    return res.status(400).json({ msg: err })
                                }
                                var new_location = {
                                    latitude: parseFloat(req.body.latitude),
                                    longitude: parseFloat(req.body.longitude),
                                    name: req.body.name,
                                    address: req.body.address,
                                    description: req.body.description,
                                    featured_img: timestamp + '.jpg',
                                    fk_type: check_type.id,
                                    fk_province: check_province.id
                                }
                                locations.create(new_location).then(async _location => {
                                    const location_result = await locations.findOne({
                                        attributes: { exclude: ['fk_province', 'fk_type'] },
                                        where: {
                                            id: _location.id
                                        },
                                        include: [{
                                            attributes: { exclude: ['fk_country'] },
                                            model: db.provinces,
                                            include: [{
                                                model: db.countries
                                            }]
                                        },
                                        {
                                            model: db.types
                                        }]
                                    })
                                    if (process.env.NODE_ENV === 'development')
                                        location_result.featured_img = 'http://' + req.headers.host + '/assets/images/locationFeatured/' + location_result.featured_img;
                                    else
                                        location_result.featured_img = 'https://' + req.headers.host + '/assets/images/locationFeatured/' + location_result.featured_img;
                                    res.status(200).json(location_result)
                                }).catch(err => {
                                    return res.status(400).json({ msg: err });
                                })
                            })
                        }
                        else {
                            return res.status(400).json({ msg: 'Wrong location type or province' })
                        }
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong location type or province' })
                    }
                }
                else {
                    return res.status(400).json({ msg: 'Wrong lat lng' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Missing featured image' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.updateWithoutFeaturedImg = (req, res) => {
    try {
        req.body.featured_img = undefined;
        locations.update(req.body, { where: { id: req.body.id } }).then(async location => {
            res.status(200).json({
                msg: 'Update successful',
                data: await locations.findByPk(req.body.id)
            })
        })
    }
    catch (err) {
        res.status(400).json({ msg: err })
    }
}

exports.update = async (req, res) => {
    try {
        const idLocation = req.body.id;
        if (typeof idLocation !== 'undefined') {
            const _location = await locations.findByPk(idLocation);
            if (_location) {
                if (typeof req.body.name !== 'undefined')
                    _location.name = req.body.name;
                if (typeof req.body.latitude !== 'undefined') {
                    if (!isNaN(req.body.latitude))
                        _location.latitude = parseFloat(req.body.latitude);
                    else
                        return res.status(400).json({ msg: 'Wrong latitude' })
                }
                if (typeof req.body.longitude !== 'undefined') {
                    if (!isNaN(req.body.longitude))
                        _location.longitude = parseFloat(req.body.longitude);
                    else
                        return res.status(400).json({ msg: 'Wrong longitude' })
                }
                if (typeof req.body.address !== 'undefined')
                    _location.address = req.body.address;
                if (typeof req.body.fk_type !== 'undefined') {
                    if (!isNaN(req.body.fk_type)) {
                        const check_type = await db.types.findByPk(parseInt(req.body.fk_type));
                        if (check_type)
                            _location.fk_type = req.body.fk_type;
                        else return res.status(400).json({ msg: 'Wrong location type' })
                    }
                    else return res.status(400).json({ msg: 'Wrong location type' })
                }
                if (typeof req.body.fk_province !== 'undefined') {
                    if (!isNaN(req.body.fk_province)) {
                        const check_province = await db.provinces.findByPk(parseInt(req.body.fk_province));
                        if (check_province)
                            _location.fk_province = req.body.fk_province;
                        else return res.status(400).json({ msg: 'Wrong province' })
                    }
                    else return res.status(400).json({ msg: 'Wrong province' })
                }
                if (typeof req.body.description !== 'undefined')
                    _location.description = req.body.description;
                if (typeof req.body.status !== 'undefined') {
                    if (arr_status.indexOf(req.body.status) !== -1)
                        _location.status = req.body.status;
                    else
                        return res.status(400).json({ msg: 'Wrong status' })
                }

                if (typeof req.file !== 'undefined') {
                    var date = new Date();
                    var timestamp = date.getTime();
                    fs.writeFile('public/assets/images/locationFeatured/' + timestamp + '.jpg', req.file.buffer, async (err) => {
                        if (err) {
                            return res.status(400).json({ msg: err })
                        }
                        if (_location.featured_img !== null) {
                            fs.unlink('public/assets/images/locationFeatured/' + _location.featured_img, (err) => {
                                if (err) {
                                    console.error(err)
                                }
                            });
                        }
                        _location.featured_img = timestamp + '.jpg';
                        await _location.save();
                        const location_result = await locations.findOne({
                            attributes: { exclude: ['fk_province', , 'fk_type'] },
                            where: {
                                id: _location.id
                            },
                            include: [{
                                attributes: { exclude: ['fk_country'] },
                                model: db.provinces,
                                include: [{
                                    model: db.countries
                                }]
                            },
                            {
                                model: db.types
                            }]
                        })
                        if (process.env.NODE_ENV === 'development')
                            location_result.featured_img = 'http://' + req.headers.host + '/assets/images/locationFeatured/' + location_result.featured_img;
                        else
                            location_result.featured_img = 'https://' + req.headers.host + '/assets/images/locationFeatured/' + location_result.featured_img;
                        return res.status(200).json({
                            msg: 'Update successful',
                            data: location_result
                        })
                    })
                }
                else {
                    await _location.save();
                    const location_result = await locations.findOne({
                        attributes: { exclude: ['fk_province', 'fk_type'] },
                        where: {
                            id: _location.id
                        },
                        include: [{
                            attributes: { exclude: ['fk_country'] },
                            model: db.provinces,
                            include: [{
                                model: db.countries
                            }]
                        },
                        {
                            model: db.types
                        }]
                    })
                    if (process.env.NODE_ENV === 'development')
                        location_result.featured_img = 'http://' + req.headers.host + '/assets/images/locationFeatured/' + location_result.featured_img;
                    else
                        location_result.featured_img = 'https://' + req.headers.host + '/assets/images/locationFeatured/' + location_result.featured_img;
                    return res.status(200).json({
                        msg: 'Update successful',
                        data: location_result
                    })
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong id location' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong id location' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.getAllWithoutPagination = (req, res) => {
    try {
        const status = req.query.status;
        var query = {
            attributes: { exclude: ['fk_type'] },
            include: [{
                model: db.types
            }]
        }
        if (status === 'active') query.where = { status: 'active' }
        if (status === 'inactive') query.where = { status: 'inactive' }
        locations.findAll(query).then(async rs => {
            const result = await helper_add_link.addLinkLocationFeaturedImgOfListLocations(rs, req.headers.host)
            res.status(200).json({
                itemCount: rs.length, //số lượng record được trả về
                data: result,
            })
        })
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
}

exports.getAllLocation = (req, res) => {
    var isAddTours = (req.query.tour == 'true');
    const page_default = 1;
    const per_page_default = 10;
    var page, per_page;
    if (typeof req.query.page === 'undefined') page = page_default;
    else page = req.query.page
    if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
    else per_page = req.query.per_page
    if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
        res.status(400).json({ msg: 'Params is invalid' })
    }
    else {
        page = parseInt(page);
        per_page = parseInt(per_page);
        const query = {
            where: {
                status: 'active'
            },
            attributes: { exclude: ['fk_type'] },
            include: [{
                model: db.types
            }],
            limit: per_page,
            offset: (page - 1) * per_page
        };
        locations.findAndCountAll(query).then(async _locations => {
            var next_page = page + 1;
            //Kiểm tra còn dữ liệu không
            if ((parseInt(_locations.rows.length) + (next_page - 2) * per_page) === parseInt(_locations.count))
                next_page = -1;
            //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
            if ((parseInt(_locations.rows.length) < per_page))
                next_page = -1;
            if (parseInt(_locations.rows.length) === 0)
                next_page = -1;
            if (isAddTours) {
                const result = await addLinkLocationFeaturedImgOfListLocationsAndAddTour(_locations.rows, req.headers.host)
                Promise.all(result).then(completed => {
                    res.status(200).json({
                        itemCount: _locations.count, //số lượng record được trả về
                        data: completed,
                        next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                    })
                })
            }
            else {
                const result = await helper_add_link.addLinkLocationFeaturedImgOfListLocations(_locations.rows, req.headers.host)
                res.status(200).json({
                    itemCount: _locations.count, //số lượng record được trả về
                    data: result,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            }
        }).catch(err => {
            res.status(400).json({ msg: err })
        })
    }
}

function toRad(num) {
    return num * Math.PI / 180;
}
function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
    var R = 6371; // Radius of the earth in km
    if (!!lat2 && !!lng2) {
        let φ1 = toRad(lat1);
        let φ2 = toRad(lat2);
        let Δφ = toRad(lat2 - lat1);
        let Δλ = toRad(lng2 - lng1);
        let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d;
    }
}

const filterListLocationByDistance = async (lat, lng, distance, _items) => {
    return _items.filter(_location_item => {
        var lat2 = _location_item.latitude;
        var lng2 = _location_item.longitude;
        return getDistanceFromLatLonInKm(lat, lng, lat2, lng2) < distance;
    })
}

exports.getLocationNearMe = async (req, res) => {
    var isAddTours = (req.query.tour == 'true');
    var distance_default = 1 //kilometer
    var lat = req.body.lat;
    var lng = req.body.lng;
    var distance = req.body.distance;
    if (typeof lat === 'undefined' ||
        typeof lng === 'undefined' ||
        isNaN(lat) || isNaN(lng) ||
        (typeof distance !== 'undefined' && isNaN(distance))) {
        return res.status(400).json({ msg: "Params is invalid" })
    }
    if (typeof distance === 'undefined') distance = distance_default;
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    distance = parseInt(distance);
    var query = {
        attributes: { exclude: ['fk_type'] },
        include: [{
            model: db.types
        }],
        where: db.sequelize.and(
            lat && lng && distance ? db.sequelize.where(
                db.sequelize.literal(`6371 * acos(cos(radians(${lat})) * cos(radians(locations.latitude)) * cos(radians(${lng}) - radians(locations.longitude)) + sin(radians(${lat})) * sin(radians(locations.latitude)))`),
                '<=',
                distance,
            ) : null,
            {
                status: 'active'
            }
        )
    }
    locations.findAll(query).then(async _items => {
        // const result = await filterListLocationByDistance(lat, lng, distance, _items)
        if (isAddTours) {
            const result = await addLinkLocationFeaturedImgOfListLocationsAndAddTour(_items, req.headers.host)
            Promise.all(result).then(completed => {
                res.status(200).json({
                    itemCount: completed.length,
                    data: completed,
                    distance: distance
                })
            })
        }
        else {
            const result = await helper_add_link.addLinkLocationFeaturedImgOfListLocations(_items, req.headers.host)
            res.status(200).json({
                itemCount: result.length,
                data: result,
                distance: distance
            })
        }
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getById = (req, res) => {
    const query = {
        attributes: { exclude: ['fk_type'] },
        where: { id: req.params.id },
        include: [{
            attributes: { exclude: ['fk_country'] },
            model: db.provinces,
            include: [{
                model: db.countries
            }]
        },
        {
            model: db.types
        }]
    }
    locations.findOne(query).then(_location => {
        if (_location !== null) {
            if (_location.featured_img !== null) {
                if (process.env.NODE_ENV === 'development')
                    _location.featured_img = 'http://' + req.headers.host + '/assets/images/locationFeatured/' + _location.featured_img;
                else
                    _location.featured_img = 'https://' + req.headers.host + '/assets/images/locationFeatured/' + _location.featured_img;
            }
        }
        res.status(200).json({ data: _location })
    }).catch(err => {
        res.status(400).json({ msg: err });
    })
}

exports.getLocationByType = async (req, res) => {
    const type = req.params.typeId;
    if (typeof type === 'undefined' || isNaN(type))
        return res.status(400).json({ msg: 'Params is invalid' });
    const query = {
        where: {
            fk_type: type,
            status: 'active'
        },
        attributes: { exclude: ['fk_type'] },
        include: [{
            model: db.types
        }],
    }
    const _type = await db.types.findByPk(type);
    locations.findAll(query).then(async _locations => {
        const location_result = await helper_add_link.addLinkLocationFeaturedImgOfListLocations(_locations, req.headers.host)
        res.status(200).json({
            data: location_result,
            type: _type
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getByTypeNearMe = async (req, res) => {
    var isAddTours = (req.query.tour == 'true');
    const distance_default = 1; //kilometer
    const type_default = 1; //Quán ăn - Nhà hàng
    var lat = req.body.lat;
    var lng = req.body.lng;
    var distance = req.body.distance;
    var type = req.body.type;
    if (typeof lat === 'undefined' ||
        typeof lng === 'undefined' ||
        isNaN(lat) || isNaN(lng) ||
        (typeof distance !== 'undefined' && isNaN(distance))) {
        return res.status(400).json({ msg: "Params is invalid" })
    }
    if (typeof distance === 'undefined') distance = distance_default;
    if (typeof type === 'undefined') type = type_default
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    distance = parseInt(distance);
    var query = {
        attributes: { exclude: ['fk_type'] },
        where: db.sequelize.and(
            lat && lng && distance ? db.sequelize.where(
                db.sequelize.literal(`6371 * acos(cos(radians(${lat})) * cos(radians(locations.latitude)) * cos(radians(${lng}) - radians(locations.longitude)) + sin(radians(${lat})) * sin(radians(locations.latitude)))`),
                '<=',
                distance,
            ) : null,
            {
                fk_type: type,
                status: 'active'
            }
        )
        ,
        include: [{
            model: db.types
        }]
    }
    locations.findAll(query).then(async _items => {
        // const result = await filterListLocationByDistance(lat, lng, distance, _items)
        if (isAddTours) {
            const result = await addLinkLocationFeaturedImgOfListLocationsAndAddTour(_items, req.headers.host)
            Promise.all(result).then(completed => {
                res.status(200).json({
                    itemCount: completed.length,
                    data: completed,
                    distance: distance
                })
            })
        }
        else {
            const result = await helper_add_link.addLinkLocationFeaturedImgOfListLocations(_items, req.headers.host)
            res.status(200).json({
                itemCount: result.length,
                data: result,
                distance: distance
            })
        }
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
} 