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
                    if (book_tour.status === 'paid') { // book tour đã paid thì mới có thể request cancel
                        const new_request = {
                            message: req.body.message,
                            fk_book_tour: idBookTour,
                            fk_user: req.userData.id
                        }
                        book_tour.status = 'pending_cancel';
                        await book_tour.save();
                        //add new record
                        await request_cancel_booking.create(new_request).then(_request => {
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
                            return res.status(400).json({ msg: 'This booking is booked' });
                        }
                        if (book_tour.status === 'cancelled') {
                            return res.status(400).json({ msg: 'This booking has been cancelled' });
                        }
                        if (book_tour.status === 'finished') {
                            return res.status(400).json({ msg: 'This booking has been finished' });
                        }
                        if (book_tour.status === 'pending_cancel') {
                            return res.status(400).json({ msg: 'This booking is pending to cancel' });
                        }
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

const sortRequest = (request1, request2) =>{
    if (request1.book_tour_history.status === 'pending_cancel')
    {
        return -1;
    }
    if (request2.book_tour_history.status === 'pending_cancel')
    {
        return 1;
    }
    return 0;
}

exports.getAllRequests = (req, res) => {
    try {
        const query = {
            attributes: {
                exclude: ['fk_book_tour', 'status']
            },
            include: [{
                attributes: {
                    exclude: ['fk_contact_info', 'fk_payment']
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
                }]
            },
            {
                model: db.users,
                attributes: ['fullname', 'email']
            }]
        }
        request_cancel_booking.findAll(query).then(_requests => {
            _requests.sort(sortRequest);
            return res.status(200).json({ data: _requests });
        })
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ msg: error.toString() })
    }
}