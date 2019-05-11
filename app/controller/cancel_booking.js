const db = require('../models');
const cancel_booking = db.cancel_booking;

exports.requestCancel = async (req, res) => {
    try {
        if (typeof req.body.idBookTour === 'undefined'
            || typeof req.body.request_message === 'undefined')
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
                },
                {
                    model: db.tour_turns
                }],
            });
            if (book_tour) {
                if (book_tour.book_tour_contact_info.fk_user === req.userData.id) {
                    if (book_tour.status === 'paid') { // book tour đã paid thì mới có thể request cancel
                        const new_request = {
                            request_message: req.body.request_message,
                            fk_book_tour: idBookTour,
                            fk_user: req.userData.id
                        }
                        book_tour.status = 'pending_cancel';
                        await book_tour.save();
                        //add new record
                        await cancel_booking.create(new_request).then(_request => {
                            return res.status(200).json({
                                data: {
                                    status: 'pending_cancel',
                                    isCancelBooking: false
                                }
                            });
                        })
                    }
                    else {
                        if (book_tour.status === 'booked') {
                            //hủy thẳng luôn
                            const new_request = {
                                request_message: req.body.request_message,
                                fk_book_tour: idBookTour,
                                fk_user: req.userData.id
                            }
                            book_tour.status = 'cancelled';
                            const tour_turn = book_tour.tour_turn
                            tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(book_tour.num_passenger);
                            await book_tour.save();
                            await tour_turn.save();
                            //add new record
                            await cancel_booking.create(new_request).then(_request => {
                                return res.status(200).json({
                                    data: {
                                        status: 'cancelled',
                                        isCancelBooking: false
                                    }
                                });
                            })
                        }
                        else return res.status(400).json({ msg: 'Can not request cancel this booking' })
                    }
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
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

const sortRequest = (request1, request2) => {
    if (request1.book_tour_history.status === 'pending_cancel') {
        return -1;
    }
    if (request2.book_tour_history.status === 'pending_cancel') {
        return 1;
    }
    return 0;
}

exports.getAllProcessCancel = (req, res) => {
    try {
        const query = {
            attributes: {
                exclude: ['fk_book_tour', 'status']
            },
            include: [{
                attributes: {
                    exclude: ['fk_contact_info', 'fk_payment', 'fk_tour_turn']
                },
                model: db.book_tour_history,
                include: [{
                    model: db.book_tour_contact_info
                },
                {
                    attributes: {
                        exclude: ['fk_book_tour']
                    },
                    model: db.passengers
                },
                {
                    model: db.payment_method
                }, {
                    attributes: ['id', 'start_date', 'end_date', 'code'],
                    model: db.tour_turns,
                    include: [{
                        attributes: ['id', 'name'],
                        model: db.tours
                    }]
                }]
            },
            {
                model: db.users,
                attributes: ['fullname', 'email']
            }]
        }
        cancel_booking.findAll(query).then(_requests => {
            _requests.sort(sortRequest);
            return res.status(200).json({ data: _requests });
        })
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}