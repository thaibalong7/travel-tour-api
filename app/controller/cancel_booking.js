const db = require('../models');
const cancel_booking = db.cancel_booking;
const send_mail_helper = require('../helper/send_email');
const cancel_policy = require('../config/setting').cancel_policy;

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
                                fk_user: req.userData.id,
                                confirm_time: new Date(),
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

exports.getAllProcessCancel = async (req, res) => {
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

//confirm một cancel_booking khi đã có request 
exports.confirmCancel = async (req, res) => {
    try {
        if (typeof req.body.idCancelBooking !== 'undefined' && typeof req.body.refund_period !== 'undefined'
            && typeof req.body.money_refunded !== 'undefined' && typeof req.body.refund_message !== 'undefined') {
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
                    if (!isNaN(money_refunded) && parseInt(money_refunded) > 0) {
                        const curDate = new Date();
                        const refund_period = new Date(req.body.refund_period + ' 00:00:00 GMT+07:00');
                        const timeDiff = refund_period - new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
                        const days_before_can_refund = parseInt(timeDiff / (1000 * 60 * 60 * 24)) //số ngày còn lại có thể lên nhận thanh toán;
                        if (days_before_can_refund > cancel_policy.time_receive_money_after_confirm) {
                            _cancel_booking.refund_period = refund_period
                            _cancel_booking.money_refunded = parseInt(money_refunded);
                            _cancel_booking.confirm_time = new Date();
                            _cancel_booking.refund_message = JSON.stringify(req.body.refund_message);
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
                        else {
                            return res.status(400).json({ msg: 'Wrong refund period' })
                        }
                    }
                    else return res.status(400).json({ msg: 'Wrong money to refunded' })
                }
                else return res.status(400).json({ msg: 'This book tour is not pending cancel' })
            }
            else {
                return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Params are invalid' })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}


exports.updateRefundPeriod = async (req, res) => {
    try {
        if (typeof req.body.idCancelBooking !== 'undefined' && typeof req.body.refund_period) {
            let _cancel_booking = await cancel_booking.findOne({
                where: {
                    id: req.body.idCancelBooking
                },
                // include: [{
                //     model: db.book_tour_history,
                //     include: [{
                //         model: db.tour_turns
                //     }]
                // }]
            })
            if (_cancel_booking) {
                const confirm_time = new Date(_cancel_booking.confirm_time);
                const refund_period = new Date(req.body.refund_period + ' 00:00:00 GMT+07:00');
                const timeDiff = refund_period - new Date(confirm_time.getFullYear() + '-' + (confirm_time.getMonth() + 1) + '-' + confirm_time.getDate() + ' 00:00:00 GMT+07:00');
                const days_before_can_refund = parseInt(timeDiff / (1000 * 60 * 60 * 24)) //số ngày còn lại có thể lên nhận thanh toán;
                if (days_before_can_refund > cancel_policy.time_receive_money_after_confirm) {
                    _cancel_booking.refund_period = refund_period
                    await _cancel_booking.save();
                    return res.status(200).json({
                        msg: 'Update refund period successful',
                        data: _cancel_booking
                    })
                }
                else {
                    return res.status(400).json({ msg: 'Wrong refund period' })
                }
            }
            else return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
        }
        else {
            return res.status(400).json({ msg: 'Params are invalid' })
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.refunded = async (req, res) => {
    try {
        if (typeof req.body.idCancelBooking !== 'undefined') {
            let _cancel_booking = await cancel_booking.findOne({
                where: {
                    id: req.body.idCancelBooking
                },
                include: [{
                    model: db.book_tour_history,
                    // include: [{
                    //     model: db.tour_turns
                    // }]
                }]
            })
            if (_cancel_booking) {
                const _book_tour_history = _cancel_booking.book_tour_history;
                if (_book_tour_history.status === 'confirm_cancel') {
                    //check xem hiện giờ có nằm trong khoảng có thể refund hay k
                    let curDate = new Date();
                    const refund_period = new Date(_cancel_booking.refund_period + ' 00:00:00 GMT+07:00');
                    curDate = new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
                    if (curDate <= refund_period) {
                        _book_tour_history.status = 'refunded';
                        if (typeof req.body.refund_message !== 'undefined') { //refund_message là một obj
                            if (req.body.refund_message !== null)
                                _cancel_booking.refund_message = JSON.stringify(req.body.refund_message);
                        }
                        _cancel_booking.refunded_time = new Date();
                        await _book_tour_history.save();
                        await _cancel_booking.save();
                        res.status(200).json({
                            msg: 'Refund successful',
                            data: _cancel_booking
                        })

                        try {
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
                                        }]
                                    }],
                                }]
                            })
                            send_mail_helper.sendRefundedEmail(req, _cancel_booking)

                            return;
                        } catch (error) {
                            // console.log(error)
                        }
                    }
                    else {
                        return res.status(400).json({ msg: 'Beyond the refund period' })
                    }
                }
                else {
                    return res.status(400).json({ msg: 'Can not refund this book tour' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}