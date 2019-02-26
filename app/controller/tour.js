const db = require('../models');
const tours = db.tours;

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
            const result = await addLinkFeaturedImg(_tours.rows, req.headers.host)
            res.status(200).json({
                itemCount: _tours.rows.length, //số lượng record được trả về
                data: result,
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
            model: db.tour_turns
        }]
    }
    tours.findOne(query).then(_tour => {
        res.status(200).json({ data: _tour })
    })
        .catch(err => {
            res.status(400).json({ msg: err })
        })
}

