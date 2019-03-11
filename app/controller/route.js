const db = require('../models');
const routes = db.routes;
const helper_add_link = require('../helper/add_full_link');
const link_img = require('../config/config').link_img

const addLinkLocationFeaturedImgOfListRoutesAndAddTour = async (_routes, host) => {
    return _routes.map(async item => {
        const query = {
            attributes: ['id', 'name'],
            include: [
                {
                    attributes: [],
                    model: db.routes,
                    where: {
                        fk_location: item.fk_location
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
        attributes: ['id', 'arrive_time', 'leave_time', 'day', 'detail', 'fk_location'],
        where: { fk_tour: idTour },
        include: [{
            model: db.locations,
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
