const db = require('../models');
const tours = db.tours;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const helper_add_link = require('../helper/add_full_link');
const helper_validate = require('../helper/validate');
const fs = require('fs');
const link_img = require('../config/setting').link_img;

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const asyncForEach = async (arr, cb) => {
    arr.forEach(cb);
}

const asyncForLoop = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i);
    }
}

const asyncForSet = async (set, cb) => {
    for (let item of set) {
        await cb(item);
    }
}

const asyncFor = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        if (await cb(arr[i], i) === true) { break }
    }
}

const sort_route = async (routes) => {
    //true nếu arrive nhỏ hơn leave
    const sync_check_time = (arrive, leave) => {
        return Date.parse('01/01/2011 ' + arrive) < Date.parse('01/01/2011 ' + leave)
    }
    const compare2Route = (route1, route2) => {
        if (parseInt(route1.day) === parseInt(route2.day)) {
            if (route1.arrive_time === null)
                return -1;
            if (sync_check_time(route1.arrive_time, route2.arrive_time)) {
                //route1 nhỏ hơn route2
                return -1;
            }
            else
                return 1
        }
        return (parseInt(route1.day) > parseInt(route2.day) ? 1 : -1)
    }
    routes.sort(compare2Route);
}

const delete_list_image = async (deleted_images, idTour) => {
    await asyncForEach(deleted_images, async (image) => {
        const _tour_image = await db.tour_images.findOne({
            where: {
                id: image.id,
                fk_tour: idTour
            }
        });
        if (_tour_image) {
            //ảnh này khớp điều kiện, xóa đi
            fs.unlink('public' + link_img.link_tour_img + _tour_image.name, (err) => {
                if (err) {
                    console.error(err)
                }
            });
            console.log('delete tour image: ', _tour_image.name)
            _tour_image.destroy();
        }
    })
}

const add_new_images_tour = async (new_images, idTour, timestamp) => {
    await asyncForEach(new_images, async (image, index) => {
        if (image.fieldname === 'new_images') {
            const name_image = idTour + '_' + timestamp + '_' + index + '.jpg';
            //optimize ảnh
            const buffer_opz = await imagemin.buffer(image.buffer, {
                plugins: [
                    imageminMozjpeg(),
                    imageminPngquant({ quality: [0.3, 0.8] })
                ]
            })
            fs.writeFile('public' + link_img.link_tour_img + name_image, buffer_opz, async (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('add new tour image: ', name_image)
                    await db.tour_images.create({
                        name: name_image,
                        fk_tour: idTour
                    })
                }
            })
        }
    })
}

const convertDiscountOfListTourTurn = async (tour_turns) => {
    for (var i = 0; i < tour_turns.length; i++) {
        tour_turns[i].discount = parseFloat(tour_turns[i].discount / 100);
    }
}

const convertDiscountOfListTour = async (tours) => {
    for (var i = 0; i < tours.length; i++) {
        await convertDiscountOfListTourTurn(tours[i].tour_turns)
    }
}

exports.createWithRoutesAndListImage_v2 = async (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined' && typeof req.body.policy !== 'undefined'
            && typeof req.body.description !== 'undefined' //&& typeof req.body.detail !== 'undefined'
            && typeof req.body.routes !== 'undefined' && typeof req.body.fk_type_tour !== 'undefined'
            && typeof req.body.num_days !== 'undefined') {
            if (Array.isArray(JSON.parse(req.body.routes))) {
                if (typeof req.files !== 'undefined') {
                    var date = new Date();
                    var timestamp = date.getTime();
                    let featured_image = null;
                    let list_image = req.files;
                    // console.log(req.files);
                    await asyncFor(list_image, async (element, i) => {
                        if (element.fieldname === 'featured_image') {
                            featured_image = element;
                            list_image.splice(i, 1);
                            return true;
                        }
                        return false;
                    })
                    const check_type = await db.type_tour.findByPk(parseInt(req.body.fk_type_tour))
                    if (check_type) {
                        // console.log(featured_image)
                        if (featured_image) {
                            //optimize ảnh
                            const buffer_opz = await imagemin.buffer(featured_image.buffer, {
                                plugins: [
                                    imageminMozjpeg(),
                                    imageminPngquant({ quality: [0.3, 0.8] })
                                ]
                            })
                            fs.writeFile('public' + link_img.link_tour_featured + timestamp + '.jpg', buffer_opz, async (err) => {
                                if (err) {
                                    return res.status(400).json({ msg: err.toString() })
                                }
                                const new_tour = {
                                    name: req.body.name,
                                    policy: req.body.policy,
                                    description: req.body.description,
                                    //detail: req.body.detail, //bỏ detail
                                    featured_img: timestamp + '.jpg',
                                    fk_type_tour: check_type.id,
                                    num_days: parseInt(req.body.num_days)
                                }
                                const list_routes = JSON.parse(req.body.routes);

                                await sort_route(list_routes);
                                if (!(await helper_validate.check_list_routes_v2(list_routes, false))) {
                                    return res.status(400).json({ msg: 'List routes is invalid' })
                                }
                                tours.create(new_tour).then(async _tour => {
                                    //change routes and get list country, province
                                    let list_provinces = new Set();
                                    let list_countries = new Set();


                                    //create list new route instead of the way of api v1
                                    await asyncForLoop(list_routes, async (route) => {
                                        let new_route = route;
                                        new_route.fk_tour = _tour.id;
                                        await db.routes.create(new_route);
                                        const check_location = await db.locations.findOne({
                                            where: {
                                                id: route.fk_location
                                            },
                                            include: [{
                                                model: db.provinces,
                                            }]
                                        })
                                        list_countries.add(parseInt(check_location.province.fk_country));
                                        list_provinces.add(parseInt(check_location.province.id));
                                    })


                                    asyncForSet(list_provinces, async (id_province) => {
                                        db.tour_provinces.create({
                                            fk_tour: _tour.id,
                                            fk_province: id_province
                                        })
                                    })
                                    asyncForSet(list_countries, async (id_country) => {
                                        db.tour_countries.create({
                                            fk_tour: _tour.id,
                                            fk_country: id_country
                                        })
                                    })
                                    //write file list image
                                    await asyncFor(list_image, async (file, i) => {
                                        if (file.fieldname === 'list_image') {
                                            const name_image = _tour.id + '_' + timestamp + '_' + i + '.jpg';
                                            //optimize ảnh
                                            const buffer_opz = await imagemin.buffer(file.buffer, {
                                                plugins: [
                                                    imageminMozjpeg(),
                                                    imageminPngquant({ quality: [0.3, 0.8] })
                                                ]
                                            })
                                            fs.writeFile('public' + link_img.link_tour_img + name_image, buffer_opz, async (err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    await db.tour_images.create({
                                                        name: name_image,
                                                        fk_tour: _tour.id
                                                    })
                                                }
                                                return false;
                                            })
                                        }
                                    })

                                    if (process.env.NODE_ENV === 'development')
                                        _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                                    else
                                        _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                                    return res.status(200).json(_tour)
                                }).catch(err => {
                                    // console.error(err);
                                    return res.status(400).json({ msg: err.toString() })
                                })
                            })
                        }
                        else {
                            return res.status(400).json({ msg: 'Missing featured image of tour' })
                        }
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong type tour' })
                    }
                }
                else {
                    return res.status(400).json({ msg: 'Missing image of tour' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Param is invalid' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }

    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.createWithRoutesAndListImage = async (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined' && typeof req.body.policy !== 'undefined'
            && typeof req.body.description !== 'undefined' //&& typeof req.body.detail !== 'undefined'
            && typeof req.body.routes !== 'undefined' && typeof req.body.fk_type_tour !== 'undefined'
            && typeof req.body.num_days !== 'undefined') {
            if (Array.isArray(JSON.parse(req.body.routes))) {
                if (typeof req.files !== 'undefined') {
                    var date = new Date();
                    var timestamp = date.getTime();
                    let featured_image = null;
                    let list_image = req.files;
                    await asyncFor(list_image, async (element, i) => {
                        if (element.fieldname === 'featured_image') {
                            featured_image = element;
                            list_image.splice(i, 1);
                            return true;
                        }
                        return false;
                    })
                    const check_type = await db.type_tour.findByPk(parseInt(req.body.fk_type_tour))
                    if (check_type) {
                        if (featured_image) {
                            //optimize ảnh
                            const buffer_opz = await imagemin.buffer(featured_image.buffer, {
                                plugins: [
                                    imageminMozjpeg(),
                                    imageminPngquant({ quality: [0.3, 0.8] })
                                ]
                            })
                            fs.writeFile('public' + link_img.link_tour_featured + timestamp + '.jpg', buffer_opz, async (err) => {
                                if (err) {
                                    return res.status(400).json({ msg: err.toString() })
                                }
                                const new_tour = {
                                    name: req.body.name,
                                    policy: req.body.policy,
                                    description: req.body.description,
                                    //detail: req.body.detail, //bỏ detail
                                    featured_img: timestamp + '.jpg',
                                    fk_type_tour: check_type.id,
                                    num_days: parseInt(req.body.num_days)
                                }
                                const list_routes = JSON.parse(req.body.routes);

                                await sort_route(list_routes);
                                if (!(await helper_validate.check_list_routes(list_routes, false))) {
                                    return res.status(400).json({ msg: 'List routes is invalid' })
                                }
                                tours.create(new_tour).then(async _tour => {
                                    //change routes and get list country, province
                                    let list_provinces = new Set();
                                    let list_countries = new Set();
                                    await asyncForLoop(list_routes, async (route) => {
                                        var _route = await db.routes.findByPk(route.id);
                                        _route.fk_tour = _tour.id;
                                        const check_location = await db.locations.findOne({
                                            where: {
                                                id: _route.fk_location
                                            },
                                            include: [{
                                                model: db.provinces,
                                            }]
                                        })
                                        list_countries.add(parseInt(check_location.province.fk_country));
                                        list_provinces.add(parseInt(check_location.province.id));
                                        await _route.save();
                                    })
                                    asyncForSet(list_provinces, async (id_province) => {
                                        db.tour_provinces.create({
                                            fk_tour: _tour.id,
                                            fk_province: id_province
                                        })
                                    })
                                    asyncForSet(list_countries, async (id_country) => {
                                        db.tour_countries.create({
                                            fk_tour: _tour.id,
                                            fk_country: id_country
                                        })
                                    })
                                    //write file list image
                                    await asyncFor(list_image, async (file, i) => {
                                        if (file.fieldname === 'list_image') {
                                            const name_image = _tour.id + '_' + timestamp + '_' + i + '.jpg';
                                            //optimize ảnh
                                            const buffer_opz = await imagemin.buffer(file.buffer, {
                                                plugins: [
                                                    imageminMozjpeg(),
                                                    imageminPngquant({ quality: [0.3, 0.8] })
                                                ]
                                            })
                                            fs.writeFile('public' + link_img.link_tour_img + name_image, buffer_opz, async (err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    await db.tour_images.create({
                                                        name: name_image,
                                                        fk_tour: _tour.id
                                                    })
                                                }
                                                return false;
                                            })
                                        }
                                    })

                                    if (process.env.NODE_ENV === 'development')
                                        _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                                    else
                                        _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                                    return res.status(200).json(_tour)
                                }).catch(err => {
                                    return res.status(400).json({ msg: err.toString() })
                                })
                            })
                        }
                        else {
                            return res.status(400).json({ msg: 'Missing featured image of tour' })
                        }
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong type tour' })
                    }
                }
                else {
                    return res.status(400).json({ msg: 'Missing image of tour' })
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
    catch (err) {
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.createWithRoutes = async (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined' && typeof req.body.policy !== 'undefined'
            && typeof req.body.description !== 'undefined' //&& typeof req.body.detail !== 'undefined'
            && typeof req.body.routes !== 'undefined' && typeof req.body.num_days !== 'undefined') {
            if (Array.isArray(JSON.parse(req.body.routes))) {
                if (typeof req.file !== 'undefined') {
                    var date = new Date();
                    var timestamp = date.getTime();
                    //optimize ảnh
                    const buffer_opz = await imagemin.buffer(req.file.buffer, {
                        plugins: [
                            imageminMozjpeg(),
                            imageminPngquant({ quality: [0.3, 0.8] })
                        ]
                    })
                    fs.writeFile('public' + link_img.link_tour_featured + timestamp + '.jpg', buffer_opz, async (err) => {
                        if (err) {
                            return res.status(400).json({ msg: err.toString() })
                        }
                        const new_tour = {
                            name: req.body.name,
                            policy: req.body.policy,
                            description: req.body.description,
                            //detail: req.body.detail,
                            featured_img: timestamp + '.jpg',
                            num_days: parseInt(req.body.num_days)
                        }
                        const list_routes = JSON.parse(req.body.routes);
                        await sort_route(list_routes);
                        if (!(await helper_validate.check_list_routes(list_routes, false))) {
                            return res.status(400).json({ msg: 'List routes is invalid' })
                        }
                        tours.create(new_tour).then(async _tour => {
                            await asyncForEach(list_routes, async (route) => {
                                // await db.routes.create({
                                //     arrive_time: route.arriveTime,
                                //     leave_time: route.leaveTime,
                                //     day: route.day,
                                //     fk_location: route.id,
                                //     fk_tour: _tour.id,
                                //     fk_transport: route.idTransport
                                // })
                                var _route = await db.routes.findByPk(route.id);
                                _route.fk_tour = _tour.id;
                                await _route.save();
                            })
                            if (process.env.NODE_ENV === 'development')
                                _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                            else
                                _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                            return res.status(200).json(_tour)
                        }).catch(err => {
                            return res.status(400).json({ msg: err.toString() })
                        })
                    })
                }
                else {
                    return res.status(400).json({ msg: 'Missing featured image of tour' })
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
    catch (err) {
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.create = async (req, res) => {
    try {
        if (typeof req.body.name !== 'undefined' && typeof req.body.policy !== 'undefined'
            && typeof req.body.description !== 'undefined' && typeof req.body.num_days !== 'undefined') {
            const new_tour = {
                name: req.body.name,
                policy: req.body.policy,
                description: req.body.description,
                //detail: req.body.detail,
                num_days: parseInt(req.body.num_days)
            }
            tours.create(new_tour).then(async _tour => {
                return res.status(200).json(_tour)
            }).catch(err => {
                return res.status(400).json({ msg: err.toString() })
            })
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.updateWithRoutes = async (req, res) => {
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _tour = await tours.findByPk(req.body.id);
            if (!_tour) {
                //k tồn tại tour này
                return res.status(400).json({ msg: 'Wrong id' })
            }
            else {
                if (typeof req.body.name !== 'undefined')
                    _tour.name = req.body.name;
                if (typeof req.body.policy !== 'undefined')
                    _tour.policy = req.body.policy;
                if (typeof req.body.description !== 'undefined')
                    _tour.description = req.body.description;
                if (typeof req.body.detail !== 'undefined')
                    _tour.detail = req.body.detail;
                if (typeof req.body.num_days !== 'undefined')
                    _tour.num_days = parseInt(req.body.num_days);
                if (typeof req.body.routes !== 'undefined') {
                    const list_routes = JSON.parse(req.body.routes);
                    await sort_route(list_routes);
                    if (!(await helper_validate.check_list_routes(list_routes, true))) {
                        return res.status(400).json({ msg: 'List routes is invalid' })
                    }
                    else {
                        //thay đổi routes
                        await db.routes.update(
                            { fk_tour: null },
                            { where: { fk_tour: _tour.id } }
                        )
                        await asyncForEach(list_routes, async (route) => {
                            var _route = await db.routes.findByPk(route.id);
                            _route.fk_tour = _tour.id;
                            await _route.save();
                        })
                    }
                }
                if (typeof req.file !== 'undefined') {
                    var date = new Date();
                    var timestamp = date.getTime();
                    //optimize ảnh
                    const buffer_opz = await imagemin.buffer(req.file.buffer, {
                        plugins: [
                            imageminMozjpeg(),
                            imageminPngquant({ quality: [0.3, 0.8] })
                        ]
                    })
                    fs.writeFile('public' + link_img.link_tour_featured + timestamp + '.jpg', buffer_opz, async (err) => {
                        if (err) {
                            return res.status(400).json({ msg: err.toString() })
                        }
                        if (_tour.featured_img !== null) {
                            //xóa file cũ đi
                            fs.unlink('public' + link_img.link_tour_featured + _tour.featured_img, (err) => {
                                if (err) {
                                    console.error(err)
                                }
                            });
                        }
                        _tour.featured_img = timestamp + '.jpg';
                        await _tour.save();
                        if (process.env.NODE_ENV === 'development')
                            _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                        else
                            _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                        return res.status(200).json({
                            msg: 'Update successful',
                            data: _tour
                        });
                    })
                }
                else {
                    await _tour.save();
                    if (process.env.NODE_ENV === 'development')
                        _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                    else
                        _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                    return res.status(200).json({
                        msg: 'Update successful',
                        data: _tour
                    });
                }
            }
        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.updateWithRoutesAndListImage = async (req, res) => {
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _tour = await tours.findByPk(req.body.id);
            if (!_tour) {
                //k tồn tại tour này
                return res.status(400).json({ msg: 'Wrong id' })
            }
            else {
                if (typeof req.body.name !== 'undefined')
                    _tour.name = req.body.name;
                if (typeof req.body.policy !== 'undefined')
                    _tour.policy = req.body.policy;
                if (typeof req.body.description !== 'undefined')
                    _tour.description = req.body.description;
                if (typeof req.body.detail !== 'undefined')
                    _tour.detail = req.body.detail;
                if (typeof req.body.num_days !== 'undefined')
                    _tour.num_days = parseInt(req.body.num_days);
                if (typeof req.body.fk_type_tour !== 'undefined') {
                    if (!isNaN(req.body.fk_type_tour)) {
                        const check_type_tour = await db.type_tour.findByPk(parseInt(req.body.fk_type_tour));
                        if (check_type_tour)
                            _tour.fk_type_tour = req.body.fk_type_tour;
                        else return res.status(400).json({ msg: 'Wrong type tour' })
                    }
                    else return res.status(400).json({ msg: 'Wrong type tour' })
                }
                if (typeof req.body.routes !== 'undefined') {
                    const list_routes = JSON.parse(req.body.routes);
                    await sort_route(list_routes);
                    if (!(await helper_validate.check_list_routes(list_routes, true))) {
                        return res.status(400).json({ msg: 'List routes is invalid' })
                    }
                    else {
                        //thay đổi routes
                        await db.routes.update(
                            { fk_tour: null },
                            { where: { fk_tour: _tour.id } }
                        )
                        await db.tour_provinces.destroy({ where: { fk_tour: _tour.id } })
                        await db.tour_countries.destroy({ where: { fk_tour: _tour.id } })
                        let list_provinces = new Set();
                        let list_countries = new Set();
                        await asyncForLoop(list_routes, async (route) => {
                            var _route = await db.routes.findByPk(route.id);
                            _route.fk_tour = _tour.id;
                            const check_location = await db.locations.findOne({
                                where: {
                                    id: _route.fk_location
                                },
                                include: [{
                                    model: db.provinces,
                                }]
                            })
                            list_countries.add(parseInt(check_location.province.fk_country));
                            list_provinces.add(parseInt(check_location.province.id));
                            await _route.save();
                        })
                        asyncForSet(list_provinces, async (id_province) => {
                            db.tour_provinces.create({
                                fk_tour: _tour.id,
                                fk_province: id_province
                            })
                        })
                        asyncForSet(list_countries, async (id_country) => {
                            db.tour_countries.create({
                                fk_tour: _tour.id,
                                fk_country: id_country
                            })
                        })
                    }
                }
                if (typeof req.body.deleted_images !== 'undefined') {
                    //xóa file image cũ in here
                    // [
                    //     {
                    //         id: 64
                    //     }
                    // ]
                    const list_delete_images = JSON.parse(req.body.deleted_images)
                    if (Array.isArray(list_delete_images)) {
                        //thỏa là array
                        // await delete_list_image(list_delete_images, _tour.id) //deleted_images là arr id, mỗi id check có phải của tour này k (query trong db ra rồi check), nếu phải thì xóa file đó đi
                        await delete_list_image(list_delete_images, _tour.id)
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong list deleted image' })
                    }
                }
                if (typeof req.files !== 'undefined') { //nếu có gởi file lên
                    var date = new Date();
                    var timestamp = date.getTime();

                    let featured_image = null;
                    let list_image = req.files;

                    await asyncFor(list_image, async (element, i) => {
                        if (element.fieldname === 'featured_image') {
                            featured_image = element;
                            list_image.splice(i, 1); //tách file có fieldname là featured_image ra
                            return true;
                        }
                        return false;
                    }) //list_image chỉ còn lại file có fieldname khác featured_image (new_images)
                    if (featured_image) { //nếu có featured_image
                        //optimize ảnh
                        const buffer_opz = await imagemin.buffer(featured_image.buffer, {
                            plugins: [
                                imageminMozjpeg(),
                                imageminPngquant({ quality: [0.3, 0.8] })
                            ]
                        })
                        fs.writeFile('public' + link_img.link_tour_featured + timestamp + '.jpg', buffer_opz, async (err) => {
                            if (err) {
                                console.log(err)
                                throw err;
                            }
                            if (_tour.featured_img !== null) {
                                //xóa file cũ đi
                                fs.unlink('public' + link_img.link_tour_featured + _tour.featured_img, (err) => {
                                    if (err) {
                                        console.error(err)
                                    }
                                });
                            }
                            _tour.featured_img = timestamp + '.jpg';
                            await _tour.save();
                        })
                        //thêm new image in here
                        await add_new_images_tour(list_image, _tour.id, timestamp);
                        await _tour.save();
                        const result_tour = await tours.findByPk(req.body.id);
                        if (process.env.NODE_ENV === 'development')
                            result_tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + result_tour.featured_img;
                        else
                            result_tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _toresult_tourur.featured_img;
                        return res.status(200).json({
                            msg: 'Update successful',
                            data: result_tour
                        });
                    }
                    else {
                        await add_new_images_tour(list_image, _tour.id, timestamp);
                        await _tour.save();
                        const result_tour = await tours.findByPk(req.body.id);
                        if (process.env.NODE_ENV === 'development')
                            result_tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + result_tour.featured_img;
                        else
                            result_tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _toresult_tourur.featured_img;
                        return res.status(200).json({
                            msg: 'Update successful',
                            data: result_tour
                        });
                    }

                }
                else {
                    await _tour.save();
                    if (process.env.NODE_ENV === 'development')
                        _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                    else
                        _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                    return res.status(200).json({
                        msg: 'Update successful',
                        data: _tour
                    });
                }
            }
        }
    }
    catch (err) {
        console.log('end err', err)
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.updateWithRoutesAndListImage_v2 = async (req, res) => {
    try {
        if (typeof req.body.id === 'undefined' || isNaN(req.body.id)) {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
        else {
            const _tour = await tours.findByPk(req.body.id);
            if (!_tour) {
                //k tồn tại tour này
                return res.status(400).json({ msg: 'Wrong id' })
            }
            else {
                if (typeof req.body.name !== 'undefined')
                    _tour.name = req.body.name;
                if (typeof req.body.policy !== 'undefined')
                    _tour.policy = req.body.policy;
                if (typeof req.body.description !== 'undefined')
                    _tour.description = req.body.description;
                if (typeof req.body.detail !== 'undefined')
                    _tour.detail = req.body.detail;
                if (typeof req.body.num_days !== 'undefined')
                    _tour.num_days = parseInt(req.body.num_days);
                if (typeof req.body.fk_type_tour !== 'undefined') {
                    if (!isNaN(req.body.fk_type_tour)) {
                        const check_type_tour = await db.type_tour.findByPk(parseInt(req.body.fk_type_tour));
                        if (check_type_tour)
                            _tour.fk_type_tour = req.body.fk_type_tour;
                        else return res.status(400).json({ msg: 'Wrong type tour' })
                    }
                    else return res.status(400).json({ msg: 'Wrong type tour' })
                }
                if (typeof req.body.routes !== 'undefined') {
                    const list_routes = JSON.parse(req.body.routes);
                    await sort_route(list_routes);
                    if (!(await helper_validate.check_list_routes_v2(list_routes, true))) {
                        return res.status(400).json({ msg: 'List routes is invalid' })
                    }
                    else {
                        //xóa routes cũ
                        await db.routes.destroy(
                            { where: { fk_tour: _tour.id } }
                        )
                        await db.tour_provinces.destroy({ where: { fk_tour: _tour.id } })
                        await db.tour_countries.destroy({ where: { fk_tour: _tour.id } })
                        let list_provinces = new Set();
                        let list_countries = new Set();
                        await asyncForLoop(list_routes, async (route) => {
                            let new_route = route;
                            new_route.fk_tour = _tour.id;
                            await db.routes.create(new_route);
                            const check_location = await db.locations.findOne({
                                where: {
                                    id: route.fk_location
                                },
                                include: [{
                                    model: db.provinces,
                                }]
                            })
                            list_countries.add(parseInt(check_location.province.fk_country));
                            list_provinces.add(parseInt(check_location.province.id));
                        })
                        asyncForSet(list_provinces, async (id_province) => {
                            db.tour_provinces.create({
                                fk_tour: _tour.id,
                                fk_province: id_province
                            })
                        })
                        asyncForSet(list_countries, async (id_country) => {
                            db.tour_countries.create({
                                fk_tour: _tour.id,
                                fk_country: id_country
                            })
                        })
                    }
                }
                if (typeof req.body.deleted_images !== 'undefined') {
                    //xóa file image cũ in here
                    // [
                    //     {
                    //         id: 64
                    //     }
                    // ]
                    const list_delete_images = JSON.parse(req.body.deleted_images)
                    if (Array.isArray(list_delete_images)) {
                        //thỏa là array
                        // await delete_list_image(list_delete_images, _tour.id) //deleted_images là arr id, mỗi id check có phải của tour này k (query trong db ra rồi check), nếu phải thì xóa file đó đi
                        await delete_list_image(list_delete_images, _tour.id)
                    }
                    else {
                        return res.status(400).json({ msg: 'Wrong list deleted image' })
                    }
                }
                if (typeof req.files !== 'undefined') { //nếu có gởi file lên
                    var date = new Date();
                    var timestamp = date.getTime();

                    let featured_image = null;
                    let list_image = req.files;

                    await asyncFor(list_image, async (element, i) => {
                        if (element.fieldname === 'featured_image') {
                            featured_image = element;
                            list_image.splice(i, 1); //tách file có fieldname là featured_image ra
                            return true;
                        }
                        return false;
                    }) //list_image chỉ còn lại file có fieldname khác featured_image (new_images)
                    if (featured_image) { //nếu có featured_image
                        //optimize ảnh
                        const buffer_opz = await imagemin.buffer(featured_image.buffer, {
                            plugins: [
                                imageminMozjpeg(),
                                imageminPngquant({ quality: [0.3, 0.8] })
                            ]
                        })
                        fs.writeFile('public' + link_img.link_tour_featured + timestamp + '.jpg', buffer_opz, async (err) => {
                            if (err) {
                                console.log(err)
                                throw err;
                            }
                            if (_tour.featured_img !== null) {
                                //xóa file cũ đi
                                fs.unlink('public' + link_img.link_tour_featured + _tour.featured_img, (err) => {
                                    if (err) {
                                        console.error(err)
                                    }
                                });
                            }
                            _tour.featured_img = timestamp + '.jpg';
                            await _tour.save();
                        })
                        //thêm new image in here
                        await add_new_images_tour(list_image, _tour.id, timestamp);
                        await _tour.save();
                        const result_tour = await tours.findByPk(req.body.id);
                        if (process.env.NODE_ENV === 'development')
                            result_tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + result_tour.featured_img;
                        else
                            result_tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _toresult_tourur.featured_img;
                        return res.status(200).json({
                            msg: 'Update successful',
                            data: result_tour
                        });
                    }
                    else {
                        await add_new_images_tour(list_image, _tour.id, timestamp);
                        await _tour.save();
                        const result_tour = await tours.findByPk(req.body.id);
                        if (process.env.NODE_ENV === 'development')
                            result_tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + result_tour.featured_img;
                        else
                            result_tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _toresult_tourur.featured_img;
                        return res.status(200).json({
                            msg: 'Update successful',
                            data: result_tour
                        });
                    }

                }
                else {
                    await _tour.save();
                    if (process.env.NODE_ENV === 'development')
                        _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                    else
                        _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img;
                    return res.status(200).json({
                        msg: 'Update successful',
                        data: _tour
                    });
                }
            }
        }
    }
    catch (err) {
        // console.log('end err', err)
        return res.status(400).json({ msg: err.toString() })
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
    if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
        return res.status(400).json({ msg: 'Params is invalid' })
    }
    else {
        page = parseInt(page);
        per_page = parseInt(per_page);
        const query = {
            include: [{
                attributes: { exclude: ['fk_tour'] },
                model: db.tour_turns,
                where: {
                    status: 'public',
                }
            }],
            attributes: { exclude: ['detail'] },
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
                itemCount: _tours.count, //số lượng record được trả về
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
            attributes: ['id', 'name', 'num_days'],
            include: [{
                model: db.tour_turns,
                //admin dùng nên k cần fillter status
            },
            {
                model: db.type_tour
            },
            {
                attributes: { exclude: ['fk_tour', 'fk_country'] },
                model: db.tour_countries,
                include: [{
                    model: db.countries
                }],
            },
            {
                attributes: { exclude: ['fk_tour', 'fk_province'] },
                model: db.tour_provinces,
                include: [
                    {
                        attributes: { exclude: ['fk_country'] },
                        model: db.provinces,
                        include: [{
                            model: db.countries
                        }],
                    }
                ]
            }]
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
        },
        {
            attributes: { exclude: ['fk_tour'] },
            model: db.reviews
        }],
        order: [[db.tour_turns, 'start_date', 'DESC'], [db.routes, 'day', 'ASC'], [db.routes, 'arrive_time', 'ASC']]
    }
    tours.findOne(query).then(async _tour => {
        if (_tour !== null) {
            if (_tour.featured_img !== null) {
                if (process.env.NODE_ENV === 'development')
                    _tour.featured_img = 'http://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img
                else
                    _tour.featured_img = 'https://' + req.headers.host + link_img.link_tour_featured + _tour.featured_img
            }
            await helper_add_link.addLinkLocationFeaturedImgOfListRoutes(_tour.routes, req.headers.host);
            await helper_add_link.addLinkTourImgOfListToursImg(_tour.tour_images, req.headers.host)
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
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            return res.status(400).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            const query = {
                include: [{
                    attributes: { exclude: ['fk_tour'] },
                    model: db.tour_turns,
                    where: {
                        status: 'public',
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
                attributes: { exclude: ['detail'] },
                order: [[db.tour_turns, 'start_date', 'DESC']],
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
                await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
                return res.status(200).json({
                    itemCount: _tours.count, //số lượng record được trả về
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
        return res.status(400).json({ msg: err.toString() })
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
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            return res.status(400).json({ msg: 'Params is invalid' })
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
                attributes: ['name'],
                // include: [{
                //     attributes: { exclude: ['fk_tour'] },
                //     model: db.tour_turns,
                //     where: {
                //         status: 'public',
                //     }
                // }],
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
                // await helper_add_link.addLinkToursFeaturedImgOfListTours(_tours.rows, req.headers.host)
                res.status(200).json({
                    itemCount: _tours.count, //số lượng record được trả về
                    data: _tours.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })

        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() })
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
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            return res.status(400).json({ msg: 'Params is invalid' })
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
                    model: db.tour_turns,
                    where: {
                        status: 'public',
                    }
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
                    itemCount: _tours.count, //số lượng record được trả về
                    data: _tours.rows,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })

        }
    }
    catch (err) {
        return res.status(400).json({ msg: err.toString() })
    }
}

const sort_tour = async (tours, key, sortType) => { //key là price, date ...
    var compare2Tour;
    if (key === 'price') {
        compare2Tour = (tour1, tour2) => {
            //lớn hơn return 1, nhỏ hơn là -1   
            return parseInt(tour1.tour_turns[0].price) - parseInt(tour2.tour_turns[0].price)
        }
    }
    if (key === 'date') {
        compare2Tour = (tour1, tour2) => {
            //lớn hơn return 1, nhỏ hơn là -1   
            const date1 = new Date(tour1.tour_turns[0].start_date)
            const date2 = new Date(tour2.tour_turns[0].start_date)
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
            return 0;
        }
    }
    if (sortType === 'ASC')
        tours.sort(compare2Tour);
    else tours.sort(compare2Tour).reverse();
}


exports.search = async (req, res) => {
    const arr_sortBy = ['price', 'date', 'rating'];
    const arr_sortType = ['ASC', 'DESC'] //ascending (tăng dần) //descending  (giảm dần)
    try {
        const name_search = req.query.name;
        const price_search = req.query.price;
        var sortBy = req.query.sortBy;
        var sortType = req.query.sortType;
        if (typeof sortBy !== 'undefined') {
            sortBy = sortBy.toLowerCase();
            if (arr_sortBy.indexOf(sortBy) === -1) sortBy = arr_sortBy[0]; //mặc định sort theo price
        }
        else sortBy = arr_sortBy[0];
        if (typeof sortType !== 'undefined') {
            sortType = sortType.toUpperCase();
            if (arr_sortType.indexOf(sortType) === -1) sortType = arr_sortType[0] //mặc định sort tăng dần
        }
        else sortType = arr_sortType[0]
        if (typeof price_search !== 'undefined' && isNaN(price_search))
            return res.status(400).json({ msg: 'Wrong price to search' })
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
                include: [{
                    attributes: { exclude: ['fk_tour'] },
                    model: db.tour_turns,
                    where: {
                        status: 'public',
                        start_date: {
                            [Op.gt]: new Date()
                        }
                    }
                }],
                limit: per_page,
                offset: (page - 1) * per_page
            }
            if (typeof price_search !== 'undefined') {
                query.include[0].where.price = {
                    [Op.lte]: parseInt(price_search)
                }
            }
            if (typeof name_search !== 'undefined') {
                query.where = {
                    name: {
                        [Op.like]: '%' + name_search + '%'
                    }
                }
            }
            if (sortBy === arr_sortBy[0]) //price
            {
                query.order = [[db.tour_turns, 'price', sortType]];
            }
            if (sortBy === arr_sortBy[1]) //date
            {
                query.order = [[db.tour_turns, 'start_date', sortType]];
            }
            tours.findAndCountAll(query).then(async _tours => {
                await sort_tour(_tours.rows, sortBy, sortType)
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
                await convertDiscountOfListTour(_tours.rows)
                res.status(200).json({
                    itemCount: _tours.count, //số lượng record được trả về
                    data: _tours.rows,
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
