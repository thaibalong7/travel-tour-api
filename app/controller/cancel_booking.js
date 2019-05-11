const db = require('../models');
const cancel_booking = db.cancel_booking;
const send_mail_helper = require('../helper/send_email')

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

const priority_status_book_tour = {
    "pending_cancel": 1,
    "confirm_cancel": 2,
    "not_refunded": 3,
    "refunded": 4,
    "cancelled": 5,
    "finished": 6,
    "paid": 7,
    "booked": 8
}

const sortRequest = (request1, request2) => {
    return (priority_status_book_tour[request1.book_tour_history.status] - priority_status_book_tour[request2.book_tour_history.status]);
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

exports.confirmCancel = async (req, res) => {
    try {
        if (typeof req.body.idCancelBooking !== 'undefined' && typeof req.body.refund_period !== 'undefined'
            && typeof req.body.money_refunded !== 'undefined') {
            let _cancel_booking = await cancel_booking.findOne({
                where: {
                    id: req.body.idCancelBooking
                },
                include: [{
                    model: db.book_tour_history,
                    include: [{
                        model: db.tour_turns
                    }]
                }]
            })
            if (_cancel_booking) {
                const _book_tour_history = _cancel_booking.book_tour_history;
                if (_book_tour_history.status === 'pending_cancel') {
                    const money_refunded = (req.body.money_refunded);
                    if (!isNaN(money_refunded) && parseInt(money_refunded) >= 0) {
                        _cancel_booking.refund_period = new Date(req.body.refund_period);
                        _cancel_booking.money_refunded = parseInt(money_refunded);
                        _cancel_booking.confirm_time = new Date();
                        _book_tour_history.status = 'confirm_cancel';
                        await _book_tour_history.save();
                        await _cancel_booking.save();

                        //đã confirm rồi thì giảm ng đi ở tour turn xuống
                        const tour_turn = _book_tour_history.tour_turn
                        tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(_book_tour_history.num_passenger);
                        await tour_turn.save();

                        res.status(200).json({
                            msg: 'Confirm successful',
                            data: _cancel_booking
                        })

                        _cancel_booking = await cancel_booking.findOne({
                            where: {
                                id: req.body.idCancelBooking
                            },
                            include: [{
                                model: db.book_tour_history,
                                include: [{
                                    model: db.book_tour_contact_info
                                },
                                {
                                    model: db.payment_method
                                },
                                {
                                    attributes: { exclude: ['fk_book_tour', 'fk_type_passenger'] },
                                    model: db.passengers,
                                    include: [{
                                        model: db.type_passenger
                                    }]
                                },
                                {
                                    model: db.tour_turns,
                                    include: [{
                                        model: db.tours,
                                        include: [{
                                            model: db.routes,
                                            include: [{
                                                model: db.locations
                                            }]
                                        }]
                                    }]
                                }],
                            }]
                        })
                        send_mail_helper.sendConfirmCancelEmail(req, _cancel_booking)

                        return;
                    }
                    else return res.status(400).json({ msg: 'Wrong money to refunded' })
                }
                else return res.status(400).json({ msg: 'This book tour is not pending cancel' })
            }
            else {
                return res.status(400).json({ msg: 'Wrong code of book_tour' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Params are invalid' })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}