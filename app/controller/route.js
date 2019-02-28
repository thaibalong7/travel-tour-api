const db = require('../models');
const routes = db.routes;

addLinkFeaturedImg = async (_routes, host) => {
    return _routes.map(item => {
        if (item.location.featured_img === null) {
            // item.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
            return item;
        }
        else {
            item.location.featured_img = host + '/assets/images/locationFeatured/' + item.location.featured_img;
            return item;
        }
    })
}

addLinkFeaturedImgAndTour = async (_routes, host) => {
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
        if (item.featured_img === null) {
            // location.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
        }
        else {
            item.featured_img = host + '/assets/images/locationFeatured/' + item.featured_img;
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
        where: { fk_tour: idTour },
        include: [{
            model: db.locations,
            include: [{
                model: db.types
            }]
        }],
        order: [['day', 'ASC'], ['arrive_time', 'ASC']]
    }
    routes.findAll(query).then(async _routes => {
        const result = await addLinkFeaturedImgAndTour(_routes, req.headers.host)
        Promise.all(result).then(completed =>{
            res.status(200).json({
                data: completed,
            })
        })  
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}
