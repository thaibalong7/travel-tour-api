const db = require('../models');
const tours = db.tours;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const addLinkToursFeaturedImgOfListTours = async (tours, host) => {
    return tours.map(item => {
        if (item.featured_img !== null) {
            if (process.env.NODE_ENV === 'development')
                item.featured_img = 'http://' + host + '/assets/images/tourFeatured/' + item.featured_img
            else
                item.featured_img = 'https://' + host + '/assets/images/tourFeatured/' + item.featured_img
        }
    })
}

const addLinkLocationFeaturedImgOfListRoutes = async (_routes, host) => {
    return _routes.map(item => {
        if (item.location.featured_img === null) {
            // item.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
            return item;
        }
        else {
            if (process.env.NODE_ENV === 'development')
                item.location.featured_img = 'http://' + host + '/assets/images/locationFeatured/' + item.location.featured_img;
            else
                item.location.featured_img = 'https://' + host + '/assets/images/locationFeatured/' + item.location.featured_img;
            return item;
        }
    })
}

exports.create = (req, res) => {
    tours.create(req.body).then(_tour => {
        res.status(200).json(_tour)
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAllTour = (req, res) => {
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
                model: db.tour_turns
            }],
            limit: per_page,
            offset: (page - 1) * per_page
        };
        tours.findAndCountAll(query).then(async _tours => {
            var next_page = page + 1;
            //Kiểm tra còn dữ liệu không
            if ((parseInt(_tours.rows.length) + (next_page - 2) * per_page) === parseInt(_tours.count))
                next_page = -1;
            //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
            if ((parseInt(_tours.rows.length) < per_page))
                next_page = -1;
            if (parseInt(_tours.rows.length) === 0)
                next_page = -1;
            await addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
            res.status(200).json({
                itemCount: _tours.rows.length, //số lượng record được trả về
                data: _tours.rows,
                next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
            })
        }).catch(err => {
            res.status(400).json({ msg: err })
        })
    }
}


exports.getById = (req, res) => {
    const idTour = req.params.id;
    const query = {
        where: { id: idTour },
        include: [{
            model: db.tour_turns,
            order: [['start_date', 'DESC']]
        },
        {
            model: db.routes,
            order: [['day', 'ASC'], ['arrive_time', 'ASC']],
            include: [{
                model: db.locations,
                include: [{
                    model: db.types
                }]
            }]
        },
        {
            model: db.tour_images
        }]
    }
    tours.findOne(query).then(async _tour => {
        if (_tour.featured_img !== null) {
            if (process.env.NODE_ENV === 'development')
                _tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + _tour.featured_img
            else
                _tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + _tour.featured_img
        }
        await addLinkLocationFeaturedImgOfListRoutes(_tour.routes, req.headers.host)
        res.status(200).json({ data: _tour })
    })
        .catch(err => {
            res.status(400).json({ msg: err })
        })
}

async function paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}



exports.getByLocation = (req, res) => {
    try {
        const idLocation = req.query.idLocation;
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page)) {
            return res.status(405).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            const query = {
                include: [{
                    model: db.tour_turns,
                    where: {
                        start_date: {
                            [Op.gt]: new Date()
                        }
                    },
                    order: [['start_date', 'ASC']]
                },
                {
                    attributes: [],
                    model: db.routes,
                    where: {
                        fk_location: idLocation
                    }
                }],
                limit: per_page,
                offset: (page - 1) * per_page
            }
            tours.findAndCountAll(query).then(async _tours => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_tours.rows.length) + (next_page - 2) * per_page) === parseInt(_tours.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_tours.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_tours.rows.length) === 0)
                    next_page = -1;
                await addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
                return res.status(200).json({
                    itemCount: _tours.rows.length, //số lượng record được trả về
                    data: _tours.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })

            // const query = {
            //     attributes: [],
            //     include: [{
            //         model: db.tours,
            //         attributes: ['id']
            //     }],
            //     where: {
            //         fk_location: idLocation
            //     }
            // };
            // db.routes.findAll(query).then(async _routes => {
            //     var next_page = page + 1;
            //     const _tours = _routes.map(value => {
            //         return value.tour
            //     })
            //     let _uniqueTours = [...new Set(_tours.map(item => item.id))]
            //     let _resultTours = await paginate(_uniqueTours, per_page, page)
            //     if (_resultTours.length < per_page) next_page = -1;
            //     tours.findAll({
            //         where: {
            //             id: {
            //                 [Op.in]: [1, 2]
            //             }
            //         },
            //         include: [{
            //             model: db.tour_turns,
            //             where: {
            //                 start_date: {
            //                     [Op.gt]: new Date()
            //                 }
            //             }
            //         }]
            //     }).then(_resultTourWithData => {
            //         return res.status(200).json({
            //             itemCount: _resultTourWithData.length, //số lượng record được trả về
            //             data: _resultTourWithData,
            //             next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
            //         })
            //     })
            // })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}


exports.searchByName = (req, res) => {
    try {
        const key_search = req.query.name;
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
                where: {
                    name: {
                        [Op.like]: '%' + key_search + '%'
                    }
                },
                include: [{
                    model: db.tour_turns
                }],
            }
            tours.findAndCountAll(query).then(async _tours => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_tours.rows.length) + (next_page - 2) * per_page) === parseInt(_tours.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_tours.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_tours.rows.length) === 0)
                    next_page = -1;
                await addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
                res.status(200).json({
                    itemCount: _tours.rows.length, //số lượng record được trả về
                    data: _tours.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })

        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.searchByPrice = (req, res) => {
    try {
        const price_search = req.query.price;
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
                where: {
                    price: {
                        [Op.lte]: parseInt(price_search)
                    }
                },
                include: [{
                    model: db.tour_turns
                }],
            }
            tours.findAndCountAll(query).then(async _tours => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_tours.rows.length) + (next_page - 2) * per_page) === parseInt(_tours.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_tours.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_tours.rows.length) === 0)
                    next_page = -1;
                await addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
                res.status(200).json({
                    itemCount: _tours.rows.length, //số lượng record được trả về
                    data: _tours.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })

        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}
