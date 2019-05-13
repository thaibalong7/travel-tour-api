const arr_status_tour_turn = ['private', 'public'];

const check_policy_allow_booking = (tour_turn) => {
    //trước 3 ngày khởi hành thì mới được book
    if (tour_turn.status === arr_status_tour_turn[0]) // tour turn đang là private
        return false;
    const cur_date = new Date();
    const timeDiff = new Date(tour_turn.start_date) - cur_date;
    const days_before_go = parseInt(timeDiff / (1000 * 60 * 60 * 24) + 1) //số ngày còn lại trc khi đi;
    if (days_before_go > parseInt(tour_turn.booking_term)) return true;
    else return false;
}

const add_is_allow_booking = async (tour_turns, isRawObj = true) => {
    for (var i = 0; i < tour_turns.length; i++) {
        if (isRawObj)
            tour_turns[i].isAllowBooking = await check_policy_allow_booking(tour_turns[i]);
        else
            tour_turns[i].dataValues.isAllowBooking = await check_policy_allow_booking(tour_turns[i]);
    }
}

const check_policy_cancel_booking = async (booking) => {
    //check theo tour turn của booking này
    if (booking.status == 'paid' || booking.status == 'booked') {
        const start_date = new Date(booking.tour_turn.start_date + ' 00:00:00 GMT+07:00');
        const cur_date = new Date();
        curDate = new Date(curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' 00:00:00 GMT+07:00');
        if (booking.payment_method.name == 'online')
            if (cur_date < start_date)
                return true;
            else return false;
        else { // payment_method là incash và tranfer
            const timeDiff = (start_date) - (cur_date);
            const days = timeDiff / (1000 * 60 * 60 * 24) //số ngày còn lại trc khi đi
            if (days > 2) //nếu còn lại trên 7 ngày -> cho phép request hủy
                return true;
            else return false //ngược lại tới cty mà chuyển
        }
    }
    return false; // book tour chưa thanh toán hoặc đang chờ hủy hoặc đã bị hủy hoặc đã đi thì k thể cancel
}

const add_is_cancel_booking = async (list_booking) => { //thêm 1 record là dựa vào policy thì hiện giờ có thể hủy đặt tour hay k
    for (var i = 0; i < list_booking.length; i++) {
        list_booking[i].isCancelBooking = await check_policy_cancel_booking(list_booking[i]);
    }
}

module.exports = {
    check_policy_allow_booking,
    add_is_allow_booking,
    check_policy_cancel_booking,
    add_is_cancel_booking
}
