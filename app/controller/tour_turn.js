const db = require('../models');
const tour_turns = db.tour_turns;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const add_link = require('../helper/add_full_link');
const validate_helper = require('../helper/validate');

const asyncForEach = async (arr, cb) => {
    arr.forEach(cb);
}

async function paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

const asyncMap = async (arr, cb) => {
    return arr.map(cb);
}

const asyncFor = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i);
    }
}

const convertDiscountOfListTourTurn = async (tour_turns) => {
    for (var i = 0; i < tour_turns.length; i++) {
        tour_turns[i].discount = parseFloat(tour_turns[i].discount / 100);
    }
}

const arr_status = ['private', 'public'];

exports.create = async (req, res) => {
    // {
    //     start_date,
    //     end_date,
    //     num_max_people,
    //     discount,
    //     idTour,
    //     price,
    //     status
    // }
    try {
        if (typeof req.body.num_max_people !== 'undefined' && typeof req.body.discount !== 'undefined'
            && typeof req.body.start_date !== 'undefined' && typeof req.body.end_date !== 'undefined'
            && typeof req.body.idTour !== 'undefined' && typeof req.body.price !== 'undefined'
            && typeof req.body.status !== 'undefined') {
            if (isNaN(req.body.num_max_people) || isNaN(req.body.discount) || isNaN(req.body.price)) {
                return res.status(400).json({ msg: 'Params is invalid' })
            }
            if (parseFloat(req.body.discount) < 0 || parseFloat(req.body.discount) > 100)
                return res.status(400).json({ msg: 'Wrong discount' })
            if (parseInt(req.body.price) <= 0)
                return res.status(400).json({ msg: 'Wrong price' })
            if (arr_status.indexOf(req.body.status) === -1)
                return res.status(400).json({ msg: 'Wrong status' })
            const new_tour_turn = {
                fk_tour: req.body.idTour,
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                num_max_people: parseInt(req.body.num_max_people),
                discount: parseFloat(req.body.discount),
                price: parseInt(req.body.price),
                status: req.body.status
            }
            if (new_tour_turn.start_date > new_tour_turn.end_date) {
                return res.status(400).json({ msg: 'Start time must be less than the end time' })
            }
            else {
                if (await db.tours.findByPk(new_tour_turn.fk_tour) === null) {
                    return res.status(400).json({ msg: 'Wrong tour id' })
                }
                else {
                    tour_turns.create(new_tour_turn).then(_tour => {
                        return res.status(200).json(_tour)
                    }).catch(err => {
                        return res.status(400).json({ msg: 'Error when create in DB' })
                    })
                }
            }
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: 'Error' })
    }
}

const asyncFilter = async (list_price_passenger, arr_id_type) => {
    return list_price_passenger.filter(value => {
        return (arr_id_type.indexOf(value.id) != -1 && value.percent !== null)
    })
}

exports.createWithPricePassenger = async (req, res) => {
    // {
    //     start_date,
    //     end_date,
    //     num_max_people,
    //     discount,
    //     idTour,
    //     price,
    //     status,
    //     price_passenger [{id: 1, percent: 50}, {}] //id là id của price_pasenger, percent là của price_passenger
    // }
    try {
        if (typeof req.body.num_max_people !== 'undefined' && typeof req.body.discount !== 'undefined'
            && typeof req.body.start_date !== 'undefined' && typeof req.body.end_date !== 'undefined'
            && typeof req.body.idTour !== 'undefined' && typeof req.body.price !== 'undefined'
            && typeof req.body.status !== 'undefined' && typeof req.body.price_passenger !== 'undefined') {
            if (isNaN(req.body.num_max_people) && isNaN(req.body.discount) && isNaN(req.body.price)) {
                return res.status(400).json({ msg: 'Params is invalid' })
            }
            if (parseFloat(req.body.discount) < 0 || parseFloat(req.body.discount) > 100)
                return res.status(400).json({ msg: 'Wrong discount' })
            if (parseInt(req.body.price) <= 0)
                return res.status(400).json({ msg: 'Wrong price' })
            if (arr_status.indexOf(req.body.status) === -1)
                return res.status(400).json({ msg: 'Wrong status' })
            var list_price_passenger;
            if (!Array.isArray(req.body.price_passenger)) {
                return res.status(400).json({ msg: 'Wrong list price passenger' })
            }
            else {
                const _types = await db.type_passenger.findAll();
                const arr_id_type = await asyncMap(_types, (type) => {
                    return type.id;
                })
                list_price_passenger = await asyncFilter(req.body.price_passenger, arr_id_type);
                if (list_price_passenger.length === 0) {
                    return res.status(400).json({ msg: 'Wrong list price passenger' })
                }
                else {
                    if (!await validate_helper.check_list_price_passenger(list_price_passenger)) {
                        return res.status(400).json({ msg: 'Wrong list price passenger' })
                    }
                }
            }
            const new_tour_turn = {
                fk_tour: req.body.idTour,
                start_date: new Date(req.body.start_date),
                end_date: new Date(req.body.end_date),
                num_max_people: parseInt(req.body.num_max_people),
                discount: parseFloat(req.body.discount),
                price: parseInt(req.body.price),
                status: req.body.status
            }
            if (new_tour_turn.start_date > new_tour_turn.end_date) {
                return res.status(400).json({ msg: 'Start time must be less than the end time' })
            }
            else {
                if (await db.tours.findByPk(new_tour_turn.fk_tour) === null) {
                    return res.status(400).json({ msg: 'Wrong tour id' })
                }
                else {
                    tour_turns.create(new_tour_turn).then(async (_tour_turn) => {
                        //add new price_pasenger in here
                        await asyncFor(list_price_passenger, async (price_passenger, i) => {
                            const new_price_passenger = {
                                percent: price_passenger.percent,
                                fk_tourturn: _tour_turn.id,
                                fk_type_passenger: price_passenger.id
                            }
                            await db.price_passenger.create(new_price_passenger);
                        })
                        return res.status(200).json(_tour_turn)
                    }).catch(err => {
                        console.log(err)
                        return res.status(400).json({ msg: 'Error when create in DB' })
                    })
                }
            }
        }
        else {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: 'Error' })
    }
}

exports.increaseView = async (req, res) => {
    try {
        const idTourTurn = req.params.id;
        if (typeof idTourTurn === 'undefined') {
            return res.status(400).json({ msg: 'Wrong id tour turn' })

        }
        else {
            const tour_turn = await tour_turns.findByPk(idTourTurn);
            if (tour_turn) {
                const view = parseInt(tour_turn.view);
                tour_turn.view = view + 1;
                tour_turn.save();
                return res.status(200).json({ msg: 'Update view successful' })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id tour turn' })
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.getByTour = (req, res) => {
    const idTour = req.params.idTour;
    if (typeof idTour === 'undefined' || isNaN(idTour)) {
        return res.status(400).json({ msg: 'Param is invalid' })
    }
    const query = {
        where: {
            fk_tour: idTour,
            status: 'public'
        },
        order: [['start_date', 'DESC']]
    }
    tour_turns.findAll(query).then(async _tour_turns => {
        await convertDiscountOfListTourTurn(_tour_turns);
        res.status(200).json({ data: _tour_turns })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

const addPriceOfListPricePassengers = async (_price_passengers, price, discount) => {
    return _price_passengers.map(price_passenger => {
        var new_obj = {};
        new_obj.type = price_passenger.type_passenger.name;
        new_obj.percent = price_passenger.percent;
        new_obj.price = parseFloat(parseInt(price_passenger.percent) / 100) * parseInt(price)
        new_obj.price = new_obj.price - parseInt(new_obj.price * discount);
        return new_obj
    })
}

exports.getById = (req, res) => {
    const id = req.params.id;
    if (typeof id === 'undefined' || isNaN(id)) {
        return res.status(400).json({ msg: 'Param is invalid' })
    }
    const query = {
        attributes: { exclude: ['fk_tour'] },
        where: {
            id: id
        },
        include: [{
            model: db.tours
        },
        {
            attributes: { exclude: ['fk_tourturn', 'fk_type_passenger'] },
            model: db.price_passenger,
            include: [{
                model: db.type_passenger
            }]
        }],
    }
    tour_turns.findOne(query).then(async _tour_turns => {
        const tour_turn = _tour_turns.dataValues;
        if (tour_turn !== null) {
            if (tour_turn.tour.featured_img !== null) {
                if (process.env.NODE_ENV === 'development')
                    tour_turn.tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
                else
                    tour_turn.tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
            }
        }
        tour_turn.discount = parseFloat(tour_turn.discount / 100);
        const list_price = await addPriceOfListPricePassengers(tour_turn.price_passengers, tour_turn.price, tour_turn.discount);
        tour_turn.price_passengers = list_price;
        res.status(200).json({ data: tour_turn })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}


exports.getById_admin = (req, res) => {
    const id = req.params.id;
    if (typeof id === 'undefined' || isNaN(id)) {
        return res.status(400).json({ msg: 'Param is invalid' })
    }
    const query = {
        attributes: { exclude: ['fk_tour'] },
        where: {
            id: id
        },
        include: [{
            model: db.tours
        },
        {
            attributes: { exclude: ['fk_tourturn', 'fk_type_passenger'] },
            model: db.price_passenger,
            include: [{
                model: db.type_passenger
            }]
        }],
    }
    tour_turns.findOne(query).then(async _tour_turns => {
        const tour_turn = _tour_turns.dataValues;
        if (tour_turn !== null) {
            if (tour_turn.tour.featured_img !== null) {
                if (process.env.NODE_ENV === 'development')
                    tour_turn.tour.featured_img = 'http://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
                else
                    tour_turn.tour.featured_img = 'https://' + req.headers.host + '/assets/images/tourFeatured/' + tour_turn.tour.featured_img
            }
        }
        res.status(200).json({ data: tour_turn })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAllWithoutPagination = (req, res) => {
    const query = {
        attributes: { exclude: ['fk_tour'] },
        include: [{
            attributes: ['id', 'name'],
            model: db.tours
        }],
        order: [['start_date', 'DESC']]
    }
    tour_turns.findAll(query).then(_tour_turns => {
        res.status(200).json({
            itemCount: _tour_turns.length, //số lượng record được trả về
            data: _tour_turns
        })
    }).catch(err => {
        res.status(400).json({ msg: err })
    })
}

exports.getAll = (req, res) => { //update here
    //thêm option sortBy vs sortType
    try {
        const arr_sortBy = ['price', 'date', 'view', 'booking', 'rating'];
        const arr_sortType = ['ASC', 'DESC'] //ascending (tăng dần) //descending  (giảm dần)
        var isUniqueTour = (req.query.isUniqueTour == 'true');
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        var sortBy = req.query.sortBy;
        var sortType = req.query.sortType;
        const isDiscount = (req.query.isDiscount == 'true');
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
            const query = {
                attributes: {
                    exclude: ['fk_tour'],
                    include: [
                        [Sequelize.literal('DATEDIFF(end_date, start_date) + 1'), 'lasting'],
                        [Sequelize.literal('CAST(price - (discount * price) / 100 AS UNSIGNED)'), 'end_price'],
                        [Sequelize.literal('price'), 'original_price'],
                    ]
                },
                include: [{
                    model: db.tours
                }],
                where: {
                    start_date: {
                        [Op.gt]: new Date()
                    },
                    status: 'public',
                },
            }
            if (isDiscount) {
                query.where.discount = {
                    [Op.gt]: 0
                }
            }
            if (typeof sortBy !== 'undefined' && typeof sortType !== 'undefined') { //2 params cùng được nhận
                sortBy = sortBy.toLowerCase();
                sortType = sortType.toUpperCase();
                if (arr_sortBy.indexOf(sortBy) === -1 || arr_sortType.indexOf(sortType) === -1) {
                    //một trong hai không đúng quy định -> k sort gì hết
                }
                else { //sort by ...
                    if (sortBy === arr_sortBy[0]) //price
                    {
                        query.order = [db.sequelize.literal('end_price ' + sortType)];
                    }
                    if (sortBy === arr_sortBy[1]) //date
                    {
                        query.order = [['start_date', sortType]];
                    }
                    if (sortBy === arr_sortBy[2]) //view
                    {
                        query.order = [['view', sortType]];
                    }
                    if (sortBy === arr_sortBy[3]) //booking
                    {
                        query.order = [['num_current_people', sortType]];
                    }
                }
            }
            tour_turns.findAndCountAll(query).then(async _tour_turns => {
                if (isUniqueTour) { //lấy unique
                    var next_page = page + 1;
                    var unique = {};
                    var distinct = [];
                    await asyncForEach(_tour_turns.rows, function (item) {
                        if (!unique[item.tour.id]) {
                            distinct.push(item);
                            unique[item.tour.id] = true;
                        }
                    });

                    //phân trang
                    const result_paginate = await paginate(distinct, per_page, page)

                    //Kiểm tra còn dữ liệu không
                    if ((parseInt(result_paginate.length) + (next_page - 2) * per_page) === parseInt(distinct.length))
                        next_page = -1
                    //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                    if ((parseInt(result_paginate.length) < per_page))
                        next_page = -1;
                    if (parseInt(result_paginate.length) === 0)
                        next_page = -1;

                    const result = await add_link.addLinkToursFeaturedImgOfListTourTurns(result_paginate, req.headers.host);
                    await convertDiscountOfListTourTurn(result);
                    res.status(200).json({
                        itemCount: distinct.length, //số lượng record được trả về
                        data: result,
                        next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                    })
                }
                else {
                    var next_page = page + 1;
                    //phân trang
                    const result_paginate = await paginate(_tour_turns.rows, per_page, page)

                    //Kiểm tra còn dữ liệu không
                    if ((parseInt(result_paginate.length) + (next_page - 2) * per_page) === parseInt(_tour_turns.rows.length))
                        next_page = -1
                    //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                    if ((parseInt(result_paginate.length) < per_page))
                        next_page = -1;
                    if (parseInt(result_paginate.length) === 0)
                        next_page = -1;

                    const result = await add_link.addLinkToursFeaturedImgOfListTourTurns(result_paginate, req.headers.host);
                    await convertDiscountOfListTourTurn(result);
                    res.status(200).json({
                        itemCount: _tour_turns.rows.length, //số lượng record được trả về
                        data: result,
                        next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                    })
                }
            })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.update = async (req, res) => {
    // {
    //     id,
    //     start_date,
    //     end_date,
    //     num_max_people,
    //     discount,
    //     price,
    //     idTour,
    //     status 
    // }
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _tour_turn = await tour_turns.findByPk(req.body.id);
            if (!_tour_turn) {
                //k tồn tại id này
                return res.status(400).json({ msg: 'Wrong id' })
            }
            if (typeof req.body.num_max_people !== 'undefined' || !isNaN(req.body.num_max_people)) { //num_max_people là hợp lệ
                if (parseInt(req.body.num_max_people) < parseInt(_tour_turn.num_current_people) || parseInt(_tour_turn.num_current_people) < 0) { //num_max_people phải lớn hơn num_current_people
                    return res.status(400).json({ msg: 'Wrong max people' })
                }
                else {
                    _tour_turn.num_max_people = parseInt(req.body.num_max_people);
                }
            }
            if (typeof req.body.discount !== 'undefined' || !isNaN(req.body.discount)) {
                if (parseFloat(req.body.discount) >= 0 && parseFloat(req.body.discount) <= 100)
                    _tour_turn.discount = parseFloat(req.body.discount);
                else return res.status(400).json({ msg: 'Wrong discount' })
            }
            if (typeof req.body.price !== 'undefined' || !isNaN(req.body.price)) {
                if (parseInt(req.body.price) > 0)
                    _tour_turn.price = parseInt(req.body.price);
                else return res.status(400).json({ msg: 'Wrong price' })
            }
            if (typeof req.body.status !== 'undefined') {
                if (arr_status.indexOf(req.body.status) !== -1)
                    _tour_turn.status = req.body.status
                else return res.status(400).json({ msg: 'Wrong status' })
            }
            if (typeof req.body.start_date !== 'undefined') { //có start_date
                if (new Date() >= new Date(_tour_turn.start_date)) //ngày hiện tại lớn hơn ngày đi - tức tour đang hoặc đã đi
                {
                    return res.status(400).json({ msg: 'Can not update this turn' })
                }
                if (typeof req.body.end_date !== 'undefined') // có end_date
                    if (new Date(req.body.start_date) < new Date(req.body.end_date) && new Date(req.body.start_date) > new Date()) {
                        //thỏa mọi điều kiện
                        _tour_turn.start_date = req.body.start_date;
                        _tour_turn.end_date = req.body.end_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                else {
                    //có start nhưng k có end_date
                    if (new Date(req.body.start_date) > new Date() && new Date(req.body.start_date) < new Date(_tour_turn.end_date)) {
                        //thỏa start date là ngày ở tương lai, và nhỏ hơn end date đã có
                        _tour_turn.start_date = req.body.start_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                }
            }
            else {
                //k có start date
                if (typeof req.body.end_date !== 'undefined') // có end_date
                {
                    if (new Date(_tour_turn.start_date) < new Date(req.body.end_date)) {
                        //thỏa end_date là sau start_date đang có
                        _tour_turn.end_date = req.body.end_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                }
            }
            if (typeof req.body.idTour !== 'undefined' || !isNaN(req.body.idTour)) {
                if (await db.tours.findByPk(req.body.idTour))
                    _tour_turn.fk_tour = req.body.idTour
                else return res.status(400).json({ msg: 'Wrong id tour' })
            }
            await _tour_turn.save();
            return res.status(200).json({
                msg: 'Update successful',
                data: _tour_turn
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}

exports.updateWithPricePassenger = async (req, res) => {
    // {
    //     id,
    //     start_date,
    //     end_date,
    //     num_max_people,
    //     discount,
    //     price,
    //     idTour,
    //     status 
    // }
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _tour_turn = await tour_turns.findByPk(req.body.id);
            if (!_tour_turn) {
                //k tồn tại id này
                return res.status(400).json({ msg: 'Wrong id' })
            }
            if (typeof req.body.num_max_people !== 'undefined' || !isNaN(req.body.num_max_people)) { //num_max_people là hợp lệ
                if (parseInt(req.body.num_max_people) < parseInt(_tour_turn.num_current_people) || parseInt(_tour_turn.num_current_people) < 0) { //num_max_people phải lớn hơn num_current_people
                    return res.status(400).json({ msg: 'Wrong max people' })
                }
                else {
                    _tour_turn.num_max_people = parseInt(req.body.num_max_people);
                }
            }
            if (typeof req.body.discount !== 'undefined' || !isNaN(req.body.discount)) {
                if (parseFloat(req.body.discount) >= 0 && parseFloat(req.body.discount) <= 100)
                    _tour_turn.discount = parseFloat(req.body.discount);
                else return res.status(400).json({ msg: 'Wrong discount' })
            }
            if (typeof req.body.price !== 'undefined' || !isNaN(req.body.price)) {
                if (parseInt(req.body.price) > 0)
                    _tour_turn.price = parseInt(req.body.price);
                else return res.status(400).json({ msg: 'Wrong price' })
            }
            if (typeof req.body.status !== 'undefined') {
                if (arr_status.indexOf(req.body.status) !== -1)
                    _tour_turn.status = req.body.status
                else return res.status(400).json({ msg: 'Wrong status' })
            }
            if (typeof req.body.start_date !== 'undefined') { //có start_date
                if (new Date() >= new Date(_tour_turn.start_date)) //ngày hiện tại lớn hơn ngày đi - tức tour đang hoặc đã đi
                {
                    return res.status(400).json({ msg: 'Can not update this turn' })
                }
                if (typeof req.body.end_date !== 'undefined') // có end_date
                    if (new Date(req.body.start_date) < new Date(req.body.end_date) && new Date(req.body.start_date) > new Date()) {
                        //thỏa mọi điều kiện
                        _tour_turn.start_date = req.body.start_date;
                        _tour_turn.end_date = req.body.end_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                else {
                    //có start nhưng k có end_date
                    if (new Date(req.body.start_date) > new Date() && new Date(req.body.start_date) < new Date(_tour_turn.end_date)) {
                        //thỏa start date là ngày ở tương lai, và nhỏ hơn end date đã có
                        _tour_turn.start_date = req.body.start_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                }
            }
            else {
                //k có start date
                if (typeof req.body.end_date !== 'undefined') // có end_date
                {
                    if (new Date(_tour_turn.start_date) < new Date(req.body.end_date)) {
                        //thỏa end_date là sau start_date đang có
                        _tour_turn.end_date = req.body.end_date;
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong date' })
                    }
                }
            }
            if (typeof req.body.idTour !== 'undefined' || !isNaN(req.body.idTour)) {
                if (await db.tours.findByPk(req.body.idTour))
                    _tour_turn.fk_tour = req.body.idTour
                else return res.status(400).json({ msg: 'Wrong id tour' })
            }
            if (typeof req.body.price_passenger !== 'undefined') {
                if (!Array.isArray(req.body.price_passenger)) {
                    return res.status(400).json({ msg: 'Wrong list price passenger' })
                }
                else {
                    const _types = await db.type_passenger.findAll();
                    const arr_id_type = await asyncMap(_types, (type) => {
                        return type.id;
                    })
                    const list_price_passenger = await asyncFilter(req.body.price_passenger, arr_id_type);
                    if (list_price_passenger.length === 0) {
                        return res.status(400).json({ msg: 'Wrong list price passenger' })
                    }
                    else {
                        if (!await validate_helper.check_list_price_passenger(list_price_passenger)) {
                            return res.status(400).json({ msg: 'Wrong list price passenger' })
                        }
                        //xóa cái cũ
                        await db.price_passenger.destroy({
                            where: {
                                fk_tourturn: _tour_turn.id
                            }
                        })

                        //thêm cái mới
                        await asyncFor(list_price_passenger, async (price_passenger, i) => {
                            const new_price_passenger = {
                                percent: price_passenger.percent,
                                fk_tourturn: _tour_turn.id,
                                fk_type_passenger: price_passenger.id
                            }
                            await db.price_passenger.create(new_price_passenger);
                        })
                    }
                }
            }
            await _tour_turn.save();
            return res.status(200).json({
                msg: 'Update successful',
                data: _tour_turn
            })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e })
    }
}

exports.search = async (req, res) => {
    const arr_sortBy = ['price', 'date','view', 'booking', 'rating'];
    const arr_sortType = ['ASC', 'DESC'] //ascending (tăng dần) //descending  (giảm dần)
    try {
        const name_search = req.query.name;
        const date_search = req.query.date;
        const price_search = req.query.price;
        const lasting_search = req.query.lasting;
        var sortBy = req.query.sortBy;
        var sortType = req.query.sortType;
        if (typeof price_search !== 'undefined' && isNaN(parseInt(price_search)))
            return res.status(400).json({ msg: 'Wrong price to search' })
        if (typeof lasting_search !== 'undefined' && isNaN(parseInt(lasting_search)))
            return res.status(400).json({ msg: 'Wrong lasting to search' })
        const page_default = 1;
        const per_page_default = 10;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            const query = {
                attributes: {
                    exclude: ['fk_tour', 'price'],
                    include: [
                        [Sequelize.literal('DATEDIFF(end_date, start_date) + 1'), 'lasting'],
                        [Sequelize.literal('CAST(price - (discount * price) / 100 AS UNSIGNED)'), 'end_price'],
                        [Sequelize.literal('price'), 'original_price'],
                    ]
                },
                include: [{
                    model: db.tours
                }],
                where: {
                    status: 'public',
                    start_date: {
                        [Op.gt]: new Date()
                    }
                },
                limit: per_page,
                offset: (page - 1) * per_page
            }
            if (typeof price_search !== 'undefined') {
                query.where.price = {
                    [Op.lte]: parseInt(price_search)
                }
            }
            if (typeof name_search !== 'undefined') {
                query.include[0].where = {
                    name: {
                        [Op.like]: '%' + name_search + '%'
                    }
                }
            }
            if (typeof date_search !== 'undefined') { //search theo start_date
                query.where.start_date = {
                    [Op.eq]: new Date((date_search)), // format: yyyy-mm-dd
                    // [Op.eq]: new Date(parseInt(date_search)), // format: timestamp
                }
            }
            if (typeof lasting_search !== 'undefined') { //nếu có search bằng lasting //cái này để cuối vì có dùng lại những thay đổi ở trên
                query.where = db.sequelize.and(
                    db.sequelize.literal('DATEDIFF(end_date, start_date) + 1 = ' + parseInt(lasting_search)),
                    query.where,
                )
            }
            if (typeof sortBy !== 'undefined' && typeof sortType !== 'undefined') { //2 params cùng được nhận
                sortBy = sortBy.toLowerCase();
                sortType = sortType.toUpperCase();
                if (arr_sortBy.indexOf(sortBy) === -1 || arr_sortType.indexOf(sortType) === -1) {
                    //một trong hai không đúng quy định -> k sort gì hết
                }
                else { //sort by ...
                    if (sortBy === arr_sortBy[0]) //price
                    {
                        query.order = [db.sequelize.literal('end_price ' + sortType)];
                    }
                    if (sortBy === arr_sortBy[1]) //date
                    {
                        query.order = [['start_date', sortType]];
                    }
                    if (sortBy === arr_sortBy[2]) //view
                    {
                        query.order = [['view', sortType]];
                    }
                    if (sortBy === arr_sortBy[3]) //booking
                    {
                        query.order = [['num_current_people', sortType]];
                    }
                }
            }
            tour_turns.findAndCountAll(query).then(async _tour_turns => {
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
                await convertDiscountOfListTourTurn(_tour_turns.rows)
                res.status(200).json({
                    itemCount: _tour_turns.count, //số lượng record được trả về
                    data: _tour_turns.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            }).catch(error => {
                return res.status(400).json({ msg: error.toString() })
            })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }

}