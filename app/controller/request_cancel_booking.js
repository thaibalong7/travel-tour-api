const db = require('../models');
const request_cancel_booking = db.request_cancel_booking;

exports.create = async (req, res) => {
    try {
        // const arr_status = ['pending', 'solved']
        if (typeof req.body.idBookTour === 'undefined'
            || typeof req.body.message === 'undefined')
            return res.status(400).json({ msg: 'Param is invalid' })
        else {
            const idBookTour = req.body.idBookTour
            if (isNaN(idBookTour)) {
                return res.status(400).json({ msg: 'Wrong book tour id' })
            }
            const book_tour = await db.book_tour_history.findOne({
                where: {
                    id: idBookTour
                },
                include: [{
                    model: db.book_tour_contact_info
                }],
            });
            if (book_tour) {
                if (book_tour.book_tour_contact_info.fk_user === req.userData.id) {
                    const new_request = {
                        message: req.body.message,
                        fk_book_tour: idBookTour,
                        fk_user: req.userData.id
                    }
                    //add new record
                    request_cancel_booking.create(new_request).then(_request => {
                        res.status(200).json(_request);
                    }).catch(err => {
                        console.error(err);
                        return res.status(400).json({ msg: 'Error when create in DB' })
                    })
                }
                else {
                    return res.status(400).json({ msg: 'User and book tour not match' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong book tour id' })
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }

}