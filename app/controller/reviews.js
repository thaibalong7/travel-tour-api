const db = require('../models');
const reviews = db.reviews;
const helper_add_link = require('../helper/add_full_link');
const helper_validate = require('../helper/validate');
const jwt = require('jsonwebtoken');
const fs = require('fs');

var publicKEY = fs.readFileSync('./app/middleware/public.key', 'utf8');
var verifyOptions = {
    expiresIn: '30d',
    algorithm: "RS256"
}

const create_review = async (req, res, _user) => {
    try {
        if (typeof req.body.comment !== 'undefined' &&
            typeof req.body.idTour !== 'undefined' && !isNaN(parseInt(req.body.idTour)) &&
            typeof req.body.rate !== 'undefined' && !isNaN(req.body.rate)) {

            if (parseFloat(req.body.rate) >= 0 && parseFloat(req.body.rate) <= 5) {
                const tour = await db.tours.findByPk(req.body.idTour)
                if (tour) {
                    var new_review = {
                        comment: req.body.comment,
                        rate: req.body.rate,
                        fk_tour: req.body.idTour,
                    }
                    if (_user !== null) {
                        new_review.fk_user = _user.id;
                        new_review.name = _user.fullname;
                        new_review.email = _user.email;
                    }
                    else {
                        if (typeof req.body.name !== 'undefined' && typeof req.body.email !== 'undefined') {
                            if (await helper_validate.validateEmail(req.body.email)) {
                                new_review.name = req.body.name;
                                new_review.email = req.body.email;
                            }
                            else {
                                return res.status(400).json({ msg: 'Wrong email format' })
                            }
                        }
                        else {
                            return res.status(400).json({ msg: 'Param is invalid' })
                        }
                    }
                    reviews.create(new_review).then(async _review => {
                        const average_rating = await db.reviews.findAll({
                            attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rate')), 'avg_rating']],
                            where: {
                                fk_tour: tour.id
                            }
                        })
                        tour.average_rating = parseFloat(parseFloat(average_rating[0].dataValues.avg_rating).toFixed(2));
                        await tour.save();
                        res.status(200).json({
                            data: {
                                review: _review,
                                average_tour: tour.average_rating
                            }
                        })
                    })
                }
                else {
                    return res.status(400).json({ msg: 'Wrong tour' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong rate' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ msg: err.toString() })
    }
}

exports.create = async (req, res) => {
    try {
        if (req.headers.authorization !== 'undefined') {
            const token = req.headers.authorization;
            var decode;
            try {
                decode = jwt.verify(token, publicKEY, verifyOptions);
            } catch (err) {
                throw new Error('Auth failed')
            }
            const check_token = await db.blacklist_tokens.findOne({ where: { token: token } })
            if (!check_token) {
                const _user = await db.users.findByPk(decode.id);
                if (!_user) {
                    throw new Error('Auth failed')
                }
                else {
                    //thỏa điều kiện có user
                    create_review(req, res, _user);
                }
            }
            else {
                throw new Error('Auth failed')
            }
        }
        else {
            //k có user
            create_review(req, res, null);
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ msg: err.toString() });
    }
}

exports.getByTour = (req, res) => {
    try {
        const arr_sortType = ['ASC', 'DESC']; //ascending (tăng dần) //descending  (giảm dần)
        const idTour = req.params.idTour;
        var sortType = req.query.sortType;
        const page_default = 1;
        const per_page_default = 5;
        var page, per_page;
        if (typeof req.query.page === 'undefined') page = page_default;
        else page = req.query.page
        if (typeof req.query.per_page === 'undefined') per_page = per_page_default;
        else per_page = req.query.per_page
        if (isNaN(page) || isNaN(per_page) || parseInt(per_page) <= 0 || parseInt(page) <= 0) {
            res.status(400).json({ msg: 'Params is invalid' })
        }
        else {
            page = parseInt(page);
            per_page = parseInt(per_page);
            const query = {
                where: {
                    fk_tour: idTour
                },
                include: [{
                    attributes: ['fullname', 'email', 'avatar'],
                    model: db.users
                }],
                attributes: { exclude: ['fk_tour', 'fk_user'] },
                limit: per_page,
                offset: (page - 1) * per_page
            }
            if (typeof sortType !== 'undefined') { //tồn tại sortType
                sortType = sortType.toUpperCase();
                if (arr_sortType.indexOf(sortType) === -1) {
                    query.order = [['createdAt', 'DESC']] //mặc định sort DESC
                }
                else {
                    query.order = [['createdAt', sortType]] //mặc định sort DESC
                }

            }
            else {
                query.order = [['createdAt', 'DESC']] //mặc định sort DESC
            }
            reviews.findAndCountAll(query).then(async _reviews => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_reviews.rows.length) + (next_page - 2) * per_page) === parseInt(_reviews.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_reviews.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_reviews.rows.length) === 0)
                    next_page = -1;
                const result = await helper_add_link.addLinkAvatarUserOfListReview(_reviews.rows, req.headers.host)
                res.status(200).json({
                    itemCount: _reviews.count, //số lượng record được trả về
                    data: result,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}