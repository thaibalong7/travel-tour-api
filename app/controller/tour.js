const db = require('../models');
const tours = db.tours;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const helper_add_link = require('../helper/add_full_link');
const helper_validate = require('../helper/validate');

const asyncForEach = async (arr, cb) => {
    arr.forEach(cb);
}

exports.createWithRoutes = async (req, res) => {
    try {
        if (!(await helper_validate.check_list_routes(req.body.routes))) {
            return res.status(400).json({ msg: 'List routes is invalid' })
        }
        const new_tour = {
            name: req.body.name,
            policy: req.body.policy,
            description: req.body.description,
            detail: req.body.detail,
        }
        const list_routes = req.body.routes;
        tours.create(new_tour).then(async _tour => {
            await asyncForEach(list_routes, async (route) => {
                await db.routes.create({
                    arrive_time: route.arriveTime,
                    leave_time: route.leaveTime,
                    day: route.day,
                    fk_location: route.id,
                    fk_tour: _tour.id
                })
            })
            return res.status(200).json(_tour)
        }).catch(err => {
            return res.status(400).json({ msg: err })
        })
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
}

exports.create = async (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined' && typeof req.body.policy !== 'undefined'
            && typeof req.body.description !== 'undefined' && typeof req.body.detail !== 'undefined') {
            const new_tour = {
                name: req.body.name,
                policy: req.body.policy,
                description: req.body.description,
                detail: req.body.detail,
            }
            tours.create(new_tour).then(async _tour => {
                return res.status(200).json(_tour)
            }).catch(err => {
                return res.status(400).json({ msg: err })
            })
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err })
    }
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
                attributes: { exclude: ['fk_tour'] },
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
            await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
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

exports.getAllWithoutPagination = (req, res) => {
    try {
        const query = {
            attributes: ['id', 'name'],
            include: [{
                model: db.tour_turns,

            }],
            // order: [[db.tour_turns, 'start_date', 'DESC']]
        }
        tours.findAll(query).then(async _tours => {
            await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours, req.headers.host)
            res.status(200).json({
                itemCount: _tours.length, //số lượng record được trả về
                data: _tours,
            })
        })
    }
    catch (err) {
        res.status(400).json({ msg: err })
    }
}

exports.getById = (req, res) => {
    const idTour = req.params.id;
    const query = {
        where: { id: idTour },
        include: [{
            attributes: { exclude: ['fk_tour'] },
            model: db.tour_turns,
        },
        {
            model: db.routes,
            attributes: { exclude: ['fk_tour', 'fk_location', 'fk_transport'] },
            include: [{
                model: db.locations,
                attributes: { exclude: ['fk_type'] },
                include: [{
                    model: db.types
                }]
            },
            {
                model: db.transports
            }]
        },
        {
            attributes: { exclude: ['fk_tour'] },
            model: db.tour_images
        }],
        order: [[db.tour_turns, 'start_date', 'DESC'], [db.routes, 'day', 'ASC'], [db.routes, 'arrive_time', 'ASC']]
    }
    tours.findOne(query).then(async _tour => {
        if (_tour !== null) {
            if (_tour.featured_img !== null) {
                if (process.env.NODE_ENV === 'development')
                    _tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + _tour.featured_img
                else
                    _tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + _tour.featured_img
            }
            await helper_add_link.addLinkLocationFeaturedImgOfListRoutes(_tour.routes, req.headers.host);
            await helper_add_link.addLinkTourImgOfListToursImg(_tour.tour_images, req.headers.host);
        }
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
                    attributes: { exclude: ['fk_tour'] },
                    model: db.tour_turns,
                    where: {
                        start_date: {
                            [Op.gt]: new Date()
                        }
                    }
                },
                {
                    attributes: [],
                    model: db.routes,
                    where: {
                        fk_location: idLocation
                    }
                }],
                order: [[db.tour_turns, 'start_date', 'DESC']],
                limit: per_page,
                offset: (page - 1) * per_page
            }
            tours.findAndCountAll(query).then(async _tours => {
                console.log(_tours)
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_tours.rows.length) + (next_page - 2) * per_page) === parseInt(_tours.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_tours.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_tours.rows.length) === 0)
                    next_page = -1;
                await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
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
                    attributes: { exclude: ['fk_tour'] },
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
                await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
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
                    attributes: { exclude: ['fk_tour'] },
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
                await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
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
