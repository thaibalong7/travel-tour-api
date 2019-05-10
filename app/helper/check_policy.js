const arr_status_tour_turn = ['private', 'public'];

const check_policy_allow_booking = (tour_turn) => {
    //trước 3 ngày khởi hành thì mới được book
    if (tour_turn.status === arr_status_tour_turn[0]) // tour turn đang là private
        return false;
    const cur_date = new Date();
    const timeDiff = new Date(tour_turn.start_date) - cur_date;
    const days_before_go = parseInt(timeDiff / (1000 * 60 * 60 * 24) + 1) //số ngày còn lại trc khi đi;
    if (days_before_go > 3) return true;
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


module.exports = {
    check_policy_allow_booking,
    add_is_allow_booking
}
