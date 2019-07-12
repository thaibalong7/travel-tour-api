const db = require('../models');
const cancel_booking = db.cancel_booking;
const send_mail_helper = require('../helper/send_email');
const cancel_policy = require('../config/setting').cancel_policy;
const socket = require('../socket');

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

//trong quy trình hủy chuyến đi //hủy book tour mà mới chỉ đặt, chưa thanh toán //booked => cancelled
exports.cancelTourTurn_CancelBookTourStatusBooked = async (req, res) => {
    try {
        const code = req.body.code;
        const book_tour = await db.book_tour_history.findOne({
            where: {
                code: code
            },
            include: [{
                model: db.tour_turns
            }, {
                model: db.book_tour_contact_info
            }]
        })
        if (typeof req.body.request_message !== 'undefined') {

            if (book_tour) {
                if (book_tour.status == 'booked') {
                    //hủy thẳng luôn
                    const new_request = {
                        fk_book_tour: book_tour.id,
                        confirm_time: new Date(),
                        request_message: req.body.request_message,
                        money_refunded: 0
                    }

                    book_tour.status = 'cancelled';
                    const tour_turn = book_tour.tour_turn
                    tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(book_tour.num_passenger);
                    await book_tour.save();
                    await tour_turn.save();
                    //add new record
                    await db.cancel_booking.create(new_request).then(async _request => {
                        res.status(200).json({
                            data: {
                                book_tour: book_tour,
                                cancel_booking: _request
                            }
                        });

                        /* Gởi Email E-Ticket */
                        const query = {
                            where: {
                                id: book_tour.id
                            },
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
                            attributes: { exclude: [] },
                        }
                        const book_tour_for_send_email = await db.book_tour_history.findOne(query);
                        socket.notiBookingChange_CancelBookTourStatusBooked(book_tour_for_send_email);
                    })

                }
                else return res.status(400).json({ msg: "This book tour don't have status 'booked'" });
            }
            else {
                return res.status(400).json({ msg: 'Wrong code' });
            }
        }
        else {
            return res.status(400).json({ msg: 'Missing params' });
        }
    } catch (error) {
        return res.status(400).json({ msg: error.toString() })
    }
}

//trong quy trình hủy chuyến đi //hủy book tour mà đã thanh toán hoặc đang chờ confirm hủy //paid || pending_cancel => confirm_cancel
exports.cancelTourTurn_ConfirmCancelBookTour = async (req, res) => {
    try {
        if (typeof req.body.code !== 'undefined' && typeof req.body.refund_period !== 'undefined'
            && typeof req.body.refund_message !== 'undefined'
            && typeof req.body.request_message !== 'undefined') {
            const check_booking = await db.book_tour_history.findOne({
                where: {
                    code: req.body.code,
                },
                include: [{
                    model: cancel_booking,
                },
                {
                    model: db.tour_turns
                }]
            })
            if (check_booking.status === 'paid') { //chưa có request
                const curDate = new Date();
                const refund_period = new Date(req.body.refund_period + ' 00:00:00 GMT+07:00');
                const timeDiff = refund_period - new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
                const days_before_can_refund = parseInt(timeDiff / (1000 * 60 * 60 * 24)) //số ngày còn lại có thể lên nhận thanh toán;
                if (days_before_can_refund > cancel_policy.time_receive_money_after_confirm) {
                    const new_request = {
                        request_message: req.body.request_message,
                        fk_book_tour: check_booking.id,
                        confirm_time: new Date(),
                        refund_period: refund_period,
                        money_refunded: check_booking.total_pay,
                        refund_message: JSON.stringify(req.body.refund_message)
                    }
                    check_booking.status = 'confirm_cancel';
                    const tour_turn = check_booking.tour_turn;
                    //update số lượng ng đi
                    tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(check_booking.num_passenger);

                    await check_booking.save();
                    await tour_turn.save();

                    //add new record
                    await cancel_booking.create(new_request).then(async _request => {
                        res.status(200).json({
                            data: _request,
                            msg: 'Confirm success'
                        });


                        try {
                            //send mail and emit socket
                            const _cancel_booking = await cancel_booking.findOne({
                                where: {
                                    id: _request.id
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
                            if (_cancel_booking.book_tour_history.book_tour_contact_info.fk_user !== null) {
                                _cancel_booking.fk_user = _cancel_booking.book_tour_history.book_tour_contact_info.fk_user;
                                _cancel_booking.save();
                            }
                            send_mail_helper.sendConfirmCancelEmail(req, _cancel_booking);
                            socket.notiBookingChange_ConfirmCancelBookTour(_cancel_booking);

                        } catch (error) {
                            console.log(error)
                        }

                    })

                }
                else {
                    return res.status(400).json({ msg: 'Wrong refund period' })
                }
            }
            else if (check_booking.status === 'pending_cancel') { //đã có request
                var _cancel_booking = check_booking.cancel_bookings[0];
                const curDate = new Date();
                const refund_period = new Date(req.body.refund_period + ' 00:00:00 GMT+07:00');
                const timeDiff = refund_period - new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
                const days_before_can_refund = parseInt(timeDiff / (1000 * 60 * 60 * 24)) //số ngày còn lại có thể lên nhận thanh toán;
                if (days_before_can_refund > cancel_policy.time_receive_money_after_confirm) {
                    _cancel_booking.refund_period = refund_period
                    _cancel_booking.money_refunded = check_booking.total_pay;
                    _cancel_booking.confirm_time = new Date();
                    _cancel_booking.refund_message = JSON.stringify(req.body.refund_message);
                    check_booking.status = 'confirm_cancel';

                    await check_booking.save();
                    await _cancel_booking.save();

                    //đã confirm rồi thì giảm ng đi ở tour turn xuống
                    const tour_turn = check_booking.tour_turn
                    tour_turn.num_current_people = parseInt(tour_turn.num_current_people) - parseInt(check_booking.num_passenger);
                    await tour_turn.save();

                    res.status(200).json({
                        msg: 'Confirm successful',
                        data: _cancel_booking
                    })

                    try {
                        _cancel_booking = await cancel_booking.findOne({
                            where: {
                                id: _cancel_booking.id
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
                        send_mail_helper.sendConfirmCancelEmail(req, _cancel_booking);
                        socket.notiBookingChange_ConfirmCancelBookTour(_cancel_booking);
                    } catch (error) {
                        console.log(error)
                    }
                }
                else {
                    return res.status(400).json({ msg: 'Wrong refund period' })
                }
            }
            else {
                return res.status(400).json({ msg: "Can not cancel this book tour" });
            }
        }
    } catch (error) {
        console.log(error)
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
                            send_mail_helper.sendConfirmCancelEmail(req, _cancel_booking);
                            socket.notiBookingChange_ConfirmCancelBookTour(_cancel_booking);
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
                    // const refund_period = new Date(_cancel_booking.refund_period + ' 00:00:00 GMT+07:00');
                    curDate = new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
                    // if (curDate <= refund_period) {
                    _book_tour_history.status = 'refunded';
                    if (typeof req.body.refund_message !== 'undefined') { //refund_message là một obj
                        if (req.body.refund_message !== null)
                            _cancel_booking.refund_message = JSON.stringify(req.body.refund_message);
                    }
                    _cancel_booking.refunded_time = new Date();
                    _cancel_booking.fk_staff = req.userData.id;
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
                        send_mail_helper.sendRefundedEmail(req, _cancel_booking);
                        socket.notiBookingChange_Refunded(_cancel_booking);
                        return;
                    } catch (error) {
                        // console.log(error)
                    }
                    // }
                    // else {
                    //     return res.status(400).json({ msg: 'Beyond the refund period' })
                    // }
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

exports.updateRefundMessage = async (req, res) => {
    try {
        if (typeof req.body.idCancelBooking !== 'undefined') {
            let _cancel_booking = await cancel_booking.findOne({
                where: {
                    id: req.body.idCancelBooking
                },
                include: [{
                    model: db.book_tour_history,
                }]
            })
            if (_cancel_booking) {
                if (_cancel_booking.book_tour_history.status == 'confirm_cancel') { //chỉ confirm_cancel mới có thể update
                    if (typeof req.body.refund_message !== 'undefined') { //refund_message là một obj
                        if (req.body.refund_message !== null) {
                            _cancel_booking.refund_message = JSON.stringify(req.body.refund_message);
                            await _cancel_booking.save();
                            _cancel_booking.dataValues.refund_message = JSON.parse(_cancel_booking.refund_message)
                            return res.status(200).json({
                                msg: 'Update refund message successful',
                                data: _cancel_booking
                            })
                        }
                        else return res.status(400).json({ msg: 'Wrong refund message' })
                    }
                    else return res.status(400).json({ msg: 'Wrong refund message' })
                }
                else {
                    return res.status(400).json({ msg: 'Status of this booking is not confirm_cancel' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}

exports.removeRequest = async (req, res) => {
    try {
        if (typeof req.body.idCancelBooking !== 'undefined') {
            let _cancel_booking = await cancel_booking.findOne({
                where: {
                    id: req.body.idCancelBooking
                },
                include: [{
                    model: db.book_tour_history,
                }]
            })
            if (_cancel_booking) {
                if (_cancel_booking.book_tour_history.status == 'pending_cancel') { //chỉ pending_cancel mới có thể chuyển về lại paid 
                    const _book_tour_history = _cancel_booking.book_tour_history;
                    _book_tour_history.status = 'paid';
                    _book_tour_history.save();
                    cancel_booking.destroy({
                        where: {
                            id: _cancel_booking.id
                        }
                    }).then(() => {
                        _book_tour_history.dataValues.message_pay = JSON.parse(_book_tour_history.message_pay)
                        return res.status(200).json({
                            msg: 'Remove request cancel booking successful',
                            data: _book_tour_history
                        })
                    }, function (err) {
                        console.log(err);
                    });

                }
                else {
                    return res.status(400).json({ msg: 'Status of this booking is not pending_cancel' })
                }
            }
            else {
                return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
            }
        }
        else {
            return res.status(400).json({ msg: 'Wrong id of cancel_booking' })
        }
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}