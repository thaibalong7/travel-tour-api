const db = require('../models');
const locations = db.locations;

addLinkFeaturedImg = async (_locations, host) => {
    return _locations.map(item => {
        if (item.featured_img === null) {
            // item.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
            return item;
        }
        else {
            item.featured_img = host + '/assets/images/locationFeatured/' + item.featured_img;
            return item;
        }
    })
}

exports.create = (req, res) => {
    locations.create(req.body).then(_location => {
        res.status(200).json(_location)
    }).catch(err => {
        res.status(400).json({ msg: err })
    })

}

exports.getAllWithoutPagination = (req, res) => {
    try {
        locations.findAll({
            include: [{
                model: db.types
            }]
        }).then(async rs => {
            const result = await addLinkFeaturedImg(rs, req.headers.host)
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
    const page_default = 1;
    const per_page_default = 10;
    var page, per_page;
    if (typeof req.query.page === 'undefined') page = page_default;
    else page = req.query.page
    if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
    else per_page = req.query.per_page
    if (isNaN(page) || isNaN(per_page)) {
        res.status(405).json({ msg: 'Params is invalid' })
    }
    else {
        page = parseInt(page);
        per_page = parseInt(per_page);
        const query = {
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
            const result = await addLinkFeaturedImg(_locations.rows, req.headers.host)
            res.status(200).json({
                itemCount: _locations.rows.length, //số lượng record được trả về
                data: result,
                next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
            })
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

filterListLocationByDistance = async (lat, lng, distance, _items) => {
    return _items.filter(_location_item => {
        var lat2 = _location_item.latitude;
        var lng2 = _location_item.longitude;
        return getDistanceFromLatLonInKm(lat, lng, lat2, lng2) < distance;
    })
}

exports.getLocationNearMe = async (req, res) => {
    var distance_default = 1 //kilometer
    var lat = req.body.lat;
    var lng = req.body.lng;
    var distance = req.body.distance;
    if (typeof lat === 'undefined' ||
        typeof lng === 'undefined' ||
        isNaN(lat) || isNaN(lng) ||
        (typeof distance !== 'undefined' && isNaN(distance))) {
        return res.status(405).json({ msg: "Params is invalid" })
    }
    if (typeof distance === 'undefined') distance = distance_default;
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    distance = parseInt(distance);

    // var query = {
    //     include: [{
    //         model: db.types
    //     }]
    // }
    // locations.findAll(query).then(async _items => {
    //     const result = await filterListLocationByDistance(lat, lng, distance, _items)
    //     const result1 = await addLinkFeaturedImg(result, req.headers.host)
    //     res.status(200).json({
    //         itemCount: result.length,
    //         data: result1,
    //         distance: distance
    //     })
    // }).catch(err => {
    //     res.status(400).json({ msg: err })
    // })

    var query = 'SELECT' +
        '*, (' +
        '6371 * acos (' +
        'cos ( radians(' + lat + ') )' +
        '* cos( radians( latitude ) )' +
        '* cos( radians( longitude ) - radians(' + lng + ') )' +
        '+ sin ( radians(' + lat + ') )' +
        '* sin( radians( latitude ) )' +
        ')' +
        ') AS distance' +
        ' FROM locations' +
        ' HAVING distance < ' + distance +
        ' ORDER BY distance' +
        ' LIMIT 0 , 20;'
    db.sequelize.query(query).then(async _items => {
        const result = await addLinkFeaturedImg(_items[0], req.headers.host)
        res.status(200).json({
            itemCount: result.length,
            data: result,
            distance: distance
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getById = (req, res) => {
    const query = {
        where: { id: req.params.id },
        include: [{
            model: db.types
        }]
    }
    locations.findOne(query).then(_location => {
        if (_location.featured_img !== null) {
            _location.featured_img = req.headers.host + '/assets/images/locationFeatured/' + _location.featured_img;
        }
        res.status(200).json({ data: _location })
    }).catch(err => {
        res.status(400).json({ msg: err });
    })
}

exports.getLocationByType = async (req, res) => {
    const type = req.params.typeId;
    if (typeof type === 'undefined' || isNaN(type))
        return res.status(405).json({ msg: 'Params is invalid' });
    const query = {
        where: { fk_type: type },
        include: [{
            model: db.types
        }],
    }
    const _type = await db.types.findByPk(type);
    locations.findAll(query).then(async _locations => {
        const location_result = await addLinkFeaturedImg(_locations, req.headers.host)
        res.status(200).json({
            data: location_result,
            type: _type
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getByTypeNearMe = async (req, res) => {
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
        return res.status(405).json({ msg: "Params is invalid" })
    }
    if (typeof distance === 'undefined') distance = distance_default;
    if (typeof type === 'undefined') type = type_default
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    distance = parseInt(distance);
    var query = {
        where: { fk_type: type },
        include: [{
            model: db.types
        }]
    }
    locations.findAll(query).then(async _items => {
        const result = await filterListLocationByDistance(lat, lng, distance, _items)
        const result1 = await addLinkFeaturedImg(result, req.headers.host)
        res.status(200).json({
            itemCount: result.length,
            data: result1,
            distance: distance
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
} 