const db = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const add_link = require('../helper/add_full_link');

async function paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

const convertDiscountAndGetNumReviewOfListTourTurn = async (tour_turns) => {
    for (var i = 0; i < tour_turns.length; i++) {
        tour_turns[i].discount = parseFloat(tour_turns[i].discount / 100);
        tour_turns[i].tour.dataValues.num_review = (await db.reviews.findAll({ where: { fk_tour: tour_turns[i].tour.id } })).length
        tour_turns[i].tour.dataValues.fk_type_tour = undefined
    }
}

const check_policy_allow_booking = (tour_turn) => {
    //trước 3 ngày khởi hành thì mới được book
    if (tour_turn.status === arr_status[0]) // tour turn đang là private
        return false;
    const cur_date = new Date();
    const timeDiff = new Date(tour_turn.start_date) - cur_date;
    const days_before_go = parseInt(timeDiff / (1000 * 60 * 60 * 24) + 1) //số ngày còn lại trc khi đi;
    if (days_before_go > 3) return true;
    else return false;
}

const add_is_allow_booking = async (tour_turns) => {
    for (var i = 0; i < tour_turns.length; i++) {
        tour_turns[i].dataValues.isAllowBooking = await check_policy_allow_booking(tour_turns[i]);
    }
}

exports.getTourTurnByCountry = async (req, res) => {
    try {
        const idCountry = parseInt(req.params.id)
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        const country = await db.countries.findByPk(idCountry);
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            res.status(405).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            db.tour_turns.findAll({
                attributes: {
                    exclude: ['fk_tour', 'price'],
                    include: [
                        [Sequelize.literal('DATEDIFF(end_date, start_date) + 1'), 'lasting'],
                        [Sequelize.literal('CAST(price - (discount * price) / 100 AS UNSIGNED)'), 'end_price'],
                        [Sequelize.literal('price'), 'original_price'],
                    ]
                },
                where: {
                    status: 'public',
                    start_date: {
                        [Op.gt]: new Date()
                    }
                },
                include: [{
                    model: db.tours,
                    include: [
                        {
                            model: db.tour_countries,
                            where: {
                                fk_country: idCountry
                            },
                            attributes: { exclude: ['fk_tour'] },
                        }
                    ]
                }],
                order: [['start_date', 'ASC']]
            }).then(async (_tour_turns) => {
                const result = _tour_turns.filter(tour_turn => tour_turn.tour !== null);
                var next_page = page + 1;
                var type_tour = null;
                //phân trang
                const result_paginate = await paginate(result, per_page, page)
                if (result_paginate.length > 0) {
                    const id_type_tour = result_paginate[0].tour.fk_type_tour;
                    type_tour = await db.type_tour.findByPk(id_type_tour);
                }
                //Kiểm tra còn dữ liệu không
                if ((parseInt(result_paginate.length) + (next_page - 2) * per_page) === parseInt(result.length))
                    next_page = -1
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(result_paginate.length) < per_page))
                    next_page = -1;
                if (parseInt(result_paginate.length) === 0)
                    next_page = -1;
                await add_link.addLinkToursFeaturedImgOfListTourTurns(result_paginate, req.headers.host)
                await convertDiscountAndGetNumReviewOfListTourTurn(result_paginate)
                await add_is_allow_booking(result_paginate);
                return res.status(200).json({
                    itemCount: result.length,
                    data: result_paginate,
                    next_page: next_page,
                    type_tour: type_tour,
                    country: country,
                })
            })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getTourTurnByProvince = async (req, res) => {
    try {
        const idProvince = parseInt(req.params.id)
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        const province = await db.provinces.findByPk(idProvince);
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            res.status(405).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            db.tour_turns.findAll({
                attributes: {
                    exclude: ['fk_tour', 'price'],
                    include: [
                        [Sequelize.literal('DATEDIFF(end_date, start_date) + 1'), 'lasting'],
                        [Sequelize.literal('CAST(price - (discount * price) / 100 AS UNSIGNED)'), 'end_price'],
                        [Sequelize.literal('price'), 'original_price'],
                    ]
                },
                where: {
                    status: 'public',
                    start_date: {
                        [Op.gt]: new Date()
                    }
                },
                include: [{
                    model: db.tours,
                    include: [
                        {
                            model: db.tour_provinces,
                            where: {
                                fk_province: idProvince
                            },
                            attributes: { exclude: ['fk_tour'] },
                        }
                    ]
                }],
                order: [['start_date', 'ASC']]
            }).then(async (_tour_turns) => {
                const result = _tour_turns.filter(tour_turn => tour_turn.tour !== null);
                var next_page = page + 1;
                var type_tour = null;
                //phân trang
                const result_paginate = await paginate(result, per_page, page)
                if (result_paginate.length > 0) {
                    const id_type_tour = result_paginate[0].tour.fk_type_tour;
                    type_tour = await db.type_tour.findByPk(id_type_tour);
                }
                //Kiểm tra còn dữ liệu không
                if ((parseInt(result_paginate.length) + (next_page - 2) * per_page) === parseInt(result.length))
                    next_page = -1
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(result_paginate.length) < per_page))
                    next_page = -1;
                if (parseInt(result_paginate.length) === 0)
                    next_page = -1;
                await add_link.addLinkToursFeaturedImgOfListTourTurns(result_paginate, req.headers.host)
                await convertDiscountAndGetNumReviewOfListTourTurn(result_paginate)
                await add_is_allow_booking(result_paginate);
                return res.status(200).json({
                    itemCount: result.length,
                    data: result_paginate,
                    next_page: next_page,
                    type_tour: type_tour,
                    province: province
                })
            })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

const arr_status = ['private', 'public'];

exports.getTourTurnByType = (req, res) => {
    try {
        const idType = parseInt(req.params.id)
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            res.status(405).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            db.tour_turns.findAndCountAll({
                attributes: {
                    exclude: ['fk_tour', 'price'],
                    include: [
                        [Sequelize.literal('DATEDIFF(end_date, start_date) + 1'), 'lasting'],
                        [Sequelize.literal('CAST(price - (discount * price) / 100 AS UNSIGNED)'), 'end_price'],
                        [Sequelize.literal('price'), 'original_price'],
                    ]
                },
                where: {
                    status: 'public',
                    start_date: {
                        [Op.gt]: new Date()
                    }
                },
                include: [{
                    model: db.tours,
                    where: {
                        fk_type_tour: idType
                    },
                }],
                order: [['start_date', 'ASC']],
                limit: per_page,
                offset: (page - 1) * per_page
            }).then(async (_tour_turns) => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_tour_turns.rows.length) + (next_page - 2) * per_page) === parseInt(_tour_turns.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_tour_turns.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_tour_turns.rows.length) === 0)
                    next_page = -1;

                await add_link.addLinkToursFeaturedImgOfListTourTurns(_tour_turns.rows, req.headers.host)
                await convertDiscountAndGetNumReviewOfListTourTurn(_tour_turns.rows);
                // const result = _tour_turns.rows.map((node) => node.get({ plain: true }));
                await add_is_allow_booking(_tour_turns.rows);
                res.status(200).json({
                    itemCount: _tour_turns.count, //số lượng record được trả về
                    data: _tour_turns.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

function compare_tour_in_countries(country1, country2) {
    return (country2.tour_countries.length - country1.tour_countries.length)
}

exports.getAllCountries = (req, res) => {
    try {
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            res.status(405).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            db.countries.findAll({
                include: [{
                    model: db.tour_countries,
                    attributes: ['id']
                }]
            }).then(async (_countries) => {
                var next_page = page + 1;
                _countries.sort(compare_tour_in_countries);
                //phân trang
                const result_paginate = await paginate(_countries, per_page, page)

                //Kiểm tra còn dữ liệu không
                if ((parseInt(result_paginate.length) + (next_page - 2) * per_page) === parseInt(_countries.length))
                    next_page = -1
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(result_paginate.length) < per_page))
                    next_page = -1;
                if (parseInt(result_paginate.length) === 0)
                    next_page = -1;
                return res.status(200).json({
                    itemCount: _countries.length,
                    data: result_paginate,
                    next_page: next_page
                })
            })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

function compare_tour_in_provinces(province1, province2) {
    return (province2.tour_provinces.length - province1.tour_provinces.length)
}

exports.getAllProvincesByCountry = (req, res) => {
    try {
        const idCountry = req.params.id;
        if (typeof idCountry === 'undefined' || isNaN(idCountry))
            return res.status(405).json({ msg: 'Wrong id country' })
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            return res.status(405).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            db.provinces.findAll({
                where: {
                    fk_country: idCountry
                },
                attributes: { exclude: ['fk_country'] },
                include: [{
                    model: db.tour_provinces,
                    attributes: ['id']
                }]
            }).then(async (_provinces) => {
                var next_page = page + 1;
                _provinces.sort(compare_tour_in_provinces);
                //phân trang
                const result_paginate = await paginate(_provinces, per_page, page)

                //Kiểm tra còn dữ liệu không
                if ((parseInt(result_paginate.length) + (next_page - 2) * per_page) === parseInt(_provinces.length))
                    next_page = -1
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(result_paginate.length) < per_page))
                    next_page = -1;
                if (parseInt(result_paginate.length) === 0)
                    next_page = -1;
                return res.status(200).json({
                    itemCount: _provinces.length,
                    data: result_paginate,
                    next_page: next_page
                })
            })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}


exports.getAllTypeTour = (req, res) => {
    try {
        db.type_tour.findAll().then(_type_tour => {
            return res.status(200).json({ data: _type_tour })
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getAllCountries_admin = (req, res) => {
    try {
        db.countries.findAll().then(_countries => {
            return res.status(200).json({ data: _countries })
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }

}

exports.getAllProvincesByCountry_admin = (req, res) => {
    try {
        const idCountry = req.params.id;
        if (typeof idCountry === 'undefined' || isNaN(idCountry))
            return res.status(405).json({ msg: 'Wrong id country' })
        db.provinces.findAll({
            where: {
                fk_country: idCountry
            },
            attributes: { exclude: ['fk_country'] },
        }).then((_provinces) => {
            return res.status(200).json({ data: _provinces })
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getAllProvinces_admin = (req, res) => {
    try {
        db.provinces.findAll({
            attributes: { exclude: ['fk_country'] },
            include: [{
                model: db.countries
            }]
        }).then((_provinces) => {
            return res.status(200).json({ data: _provinces })
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.createTypeTour = (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined') {
            db.type_tour.create({ name: req.body.name }).then(_type_tour => {
                res.status(200).json(_type_tour)
            }).catch(err => {
                // console.error(err);
                return res.status(400).json({ msg: err.toString() })
            })
        } else {
            res.status(400).json({ msg: 'Param is invalid' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.updateTypeTour = (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined') {
            db.type_tour.update(req.body, {
                where: {
                    id: req.body.id
                }
            }).then(async () => {
                res.status(200).json({
                    msg: 'Update successful',
                    data: await db.type_tour.findByPk(req.body.id)
                })
            }).catch(err => {
                res.status(400).json({ msg: err })
            })
        }
        else {
            res.status(400).json({ msg: 'Param is invalid' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.createCountry = (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined') {
            db.countries.create({ name: req.body.name }).then(_country => {
                res.status(200).json(_country)
            }).catch(err => {
                console.error(err);
                return res.status(400).json({ msg: err.toString() })
            })
        } else {
            res.status(400).json({ msg: 'Param is invalid' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.updateCountry = (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined') {
            db.countries.update(req.body, {
                where: {
                    id: req.body.id
                }
            }).then(async () => {
                res.status(200).json({
                    msg: 'Update successful',
                    data: await db.countries.findByPk(req.body.id)
                })
            }).catch(err => {
                res.status(400).json({ msg: err })
            })
        }
        else {
            res.status(400).json({ msg: 'Param is invalid' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.createProvince = async (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined') {
            const idCountry = req.body.idCountry;
            if (typeof idCountry === 'undefined' || isNaN(idCountry))
                return res.status(405).json({ msg: 'Wrong id country' })
            const check_country = await db.countries.findByPk(idCountry);
            if (check_country) {
                db.provinces.create({
                    name: req.body.name,
                    fk_country: idCountry
                }).then(async _province => {
                    res.status(200).json(await db.provinces.findOne({
                        where: {
                            id: _province.id
                        },
                        attributes: { exclude: ['fk_country'] },
                        include: [{
                            model: db.countries
                        }]
                    }))
                }).catch(err => {
                    // console.error(err);
                    return res.status(400).json({ msg: err.toString() })
                })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id country' })
            }
        } else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.updateProvince = async (req, res) => {
    try {
        const idProvince = req.body.id;
        if (typeof idProvince === 'undefined' || isNaN(idProvince))
            return res.status(405).json({ msg: 'Wrong id country' })
        const _province = await db.provinces.findByPk(idProvince);
        if (_province) {
            if (typeof req.body.name !== 'undefined') {
                _province.name = req.body.name;
            }
            if (typeof req.body.fk_country !== 'undefined') {
                const _country = await db.countries.findByPk(req.body.fk_country);
                if (_country) {
                    _province.fk_country = _country.id;
                }
                else {
                    return res.status(400).json({ msg: 'Wrong id country' })
                }
            }
            await _province.save();
            res.status(200).json({
                msg: 'Update successful',
                data: await db.provinces.findOne({
                    where: {
                        id: _province.id
                    },
                    attributes: { exclude: ['fk_country'] },
                    include: [{
                        model: db.countries
                    }]
                })
            })
        }
        else {
            return res.status(400).json({ msg: 'Wrong id province' })
        }
    } catch (error) {
        // console.log(error)
        return res.status(400).json({ msg: error.toString() })
    }
}