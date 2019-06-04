var io = require('socket.io')();
const helper = require('../helper');
function createSocketServer(server) {
    try {
        io.listen(server);
        console.log('Start server socket ...');
        io.on('connection', function (socket) {
            console.log(`${socket.id} is connected`);
            // socket.on('message', function (data) {
            //     console.log(`${data} is send`);
            // });
        });
    } catch (error) {
        console.error(error);
    }
}

function notiBookingChange_BookNewTour(data) {
    if (data.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: data.book_tour_contact_info.fk_user,
            title: "Đã đặt tour mới",
            content: "Bạn vừa book tour " + data.tour_turn.tour.name + " cho " + data.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(data.tour_turn.start_date))
                + ". Vui lòng thanh toán đúng thời hạn quy định."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

function notiBookingChange_BookNewTourPayOnline(data) { //thanh toán luôn qua online
    if (data.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: data.book_tour_contact_info.fk_user,
            title: "Đã đặt tour mới",
            content: "Bạn vừa book tour " + data.tour_turn.tour.name + " cho " + data.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(data.tour_turn.start_date))
                + " và đã được thanh toán online. Hẹn gặp lại vào chuyến đi sắp tới."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

function notiBookingChange_PayBookTour(data) { //thanh toán luôn qua online
    if (data.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: data.book_tour_contact_info.fk_user,
            title: "Thanh toán thành công",
            content: "Bạn vừa được thanh toán cho book tour " + data.tour_turn.tour.name + ", " + data.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(data.tour_turn.start_date))
                + ", mã đặt tour #" + data.code + ". Hẹn gặp lại vào chuyến đi sắp tới."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

function notiBookingChange_CancelBookTourStatusBooked(data) { //thanh toán luôn qua online
    if (data.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: data.book_tour_contact_info.fk_user,
            title: "Hủy đặt tour",
            content: "Bạn vừa được hủy đặt tour " + data.tour_turn.tour.name + ", " + data.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(data.tour_turn.start_date))
                + ", mã đặt tour #" + data.code + "."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

function notiBookingChange_ConfirmCancelBookTour(cancel_booking) { //thanh toán luôn qua online
    if (cancel_booking.book_tour_history.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: cancel_booking.book_tour_history.book_tour_contact_info.fk_user,
            title: "Xác nhận hủy đặt tour",
            content: "Bạn vừa được xác nhận hủy đặt tour " + cancel_booking.book_tour_history.tour_turn.tour.name + ", " + cancel_booking.book_tour_history.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(cancel_booking.book_tour_history.tour_turn.start_date))
                + ", mã đặt tour #" + cancel_booking.book_tour_history.code + ". Số tiền bạn được hoàn trả là " + helper.formatNumber(cancel_booking.money_refunded) + " VNĐ."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

function notiBookingChange_CancelBookTourOffline(cancel_booking) { //thanh toán luôn qua online
    if (cancel_booking.book_tour_history.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: cancel_booking.book_tour_history.book_tour_contact_info.fk_user,
            title: "Hủy đặt tour",
            content: "Bạn vừa được hủy đặt tour " + cancel_booking.book_tour_history.tour_turn.tour.name + ", " + cancel_booking.book_tour_history.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(cancel_booking.book_tour_history.tour_turn.start_date))
                + ", mã đặt tour #" + cancel_booking.book_tour_history.code + ". Số tiền đã hoàn trả là " + helper.formatNumber(cancel_booking.money_refunded) + " VNĐ."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

function notiBookingChange_Refunded(cancel_booking) { //nhận hoàn tiền
    if (cancel_booking.book_tour_history.book_tour_contact_info.fk_user !== null) {
        io.sockets.emit('BOOKING_TOUR_CHANGE', {
            idUser: cancel_booking.book_tour_history.book_tour_contact_info.fk_user,
            title: "Đã hoàn tiền",
            content: "Bạn vừa được hoàn tiền hủy đặt tour " + cancel_booking.book_tour_history.tour_turn.tour.name + ", " + cancel_booking.book_tour_history.passengers.length + " người đi vào ngày " + helper.toStringDate(new Date(cancel_booking.book_tour_history.tour_turn.start_date))
                + ", mã đặt tour #" + cancel_booking.book_tour_history.code + ". Số tiền đã hoàn trả là " + helper.formatNumber(cancel_booking.money_refunded) + " VNĐ."
        });
        console.log('Emit socket BOOKING_TOUR_CHANGE');
    }
}

module.exports = {
    createSocketServer,
    notiBookingChange_BookNewTour,
    notiBookingChange_BookNewTourPayOnline,
    notiBookingChange_PayBookTour,
    notiBookingChange_CancelBookTourStatusBooked,
    notiBookingChange_ConfirmCancelBookTour,
    notiBookingChange_CancelBookTourOffline,
    notiBookingChange_Refunded

};