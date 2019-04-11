const db = require('../models');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getTourTurnByCountry = (req, res) => {
    try {
        const idCountry = parseInt(req.params.id)
        db.tour_turns.findAll({
            attributes: { exclude: ['fk_tour'] },
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
            }]
        }).then((_tour_turns) => {
            return res.status(200).json({ data: _tour_turns.filter(tour_turn => tour_turn.tour !== null) })
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getTourTurnByProvince = (req, res) => {
    try {
        const idProvince = parseInt(req.params.id)
        db.tour_turns.findAll({
            attributes: { exclude: ['fk_tour'] },
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
            }]
        }).then((_tour_turns) => {
            return res.status(200).json({ data: _tour_turns.filter(tour_turn => tour_turn.tour !== null) })
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

function compare_tour_in_countries(country1, country2) {
    return (country2.tour_countries.length - country1.tour_countries.length)
}

async function paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
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
        console.error(error);
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
        console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}