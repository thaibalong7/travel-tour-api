const db = require('../models');
const comments = db.comments;
const helper_add_link = require('../helper/add_full_link');

exports.create = async (req, res) => {
    try {
        if (typeof req.body.content !== 'undefined' && typeof req.body.idTour !== 'undefined' && !isNaN(req.body.idTour)) {
            const tour = await db.tours.findByPk(req.body.idTour)
            if (tour) {
                var new_comment = {
                    content: req.body.content,
                    fk_tour: req.body.idTour,
                    fk_user: req.userData.id
                }
                comments.create(new_comment).then(_comment => {
                    res.status(200).json(_comment)
                })
            }
            else {
                res.status(400).json({ msg: 'Wrong tour' })
            }
        }
        else {
            res.status(400).json({ msg: 'Param is invalid' })
        }
    }
    catch (err) {
        res.status(400).json({ msg: err })
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
                attributes: { exclude: ['fk_tour', 'fk_user'] },
                include: [{
                    attributes: ['fullname', 'avatar'],
                    model: db.users,
                }],
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
            comments.findAndCountAll(query).then(async _comments => {
                var next_page = page + 1;
                //Kiểm tra còn dữ liệu không
                if ((parseInt(_comments.rows.length) + (next_page - 2) * per_page) === parseInt(_comments.count))
                    next_page = -1;
                //Nếu số lượng record nhỏ hơn per_page  ==> không còn dữ liệu nữa => trả về -1 
                if ((parseInt(_comments.rows.length) < per_page))
                    next_page = -1;
                if (parseInt(_comments.rows.length) === 0)
                    next_page = -1;
                const result = await helper_add_link.addLinkAvatarUserOfListComment(_comments.rows, req.headers.host);
                res.status(200).json({
                    itemCount: _comments.count, //số lượng record được trả về
                    data: result,
                    next_page: next_page //trang kế tiếp, nếu là -1 thì hết data rồi
                })
            })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}