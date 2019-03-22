
const validateEmail = async (email) => {
    var Regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/
    return Regex.test(email);
}
const validatePhoneNumber = async (phone_number) => {
    var Regex = /^\d{10}$/
    return Regex.test(phone_number);
}

const check_time = async (arrive, leave) => {
    return Date.parse('01/01/2011 ' + arrive) < Date.parse('01/01/2011 ' + leave)
}

const check_2_routes = async (i, routes1, routes2, length) => {
    // console.log('check ', i)
    if (typeof routes1.id === 'undefined' || typeof routes1.day === 'undefined'
        || typeof routes2.id === 'undefined' || typeof routes2.day === 'undefined'
        || typeof routes1.arrive_time === 'undefined' || typeof routes1.leave_time === 'undefined'
        || typeof routes2.arrive_time === 'undefined' || typeof routes2.leave_time === 'undefined'
        || isNaN(routes1.id) || isNaN(routes2.id)
        || isNaN(routes1.day) || isNaN(routes2.day
            || typeof routes1.fk_tour === 'undefined' || typeof routes2.fk_tour === 'undefined')) { //check dữ liệu truyền vào có đúng
        // console.log('false 1');
        return false;
    }
    else {
        if (routes1.fk_tour !== null || routes2.fk_tour !== null) {
            return false;
        }
        if (i === 0 && ((parseInt(routes1.day) !== 1) || routes1.leave_time === null)) { //routes đầu tiên và có day khác 1 hoặc leave_time là null
            // console.log('false 2');
            return false;
        }
        else {
            if (i !== 0 && (routes1.arrive_time === null || routes1.leave_time === null)) //k phải route đầu tiên và có thời gian là null
            {
                // console.log('false 3');
                return false;
            }
            else {
                if (((await check_time(routes1.arrive_time, routes1.leave_time)) === false)
                    && (parseInt(routes2.day) <= parseInt(routes1.day) || !await check_time(routes1.leave_time, routes2.arrive_time))) //thời gian rời khỏi là ngày hôm sau nhưng route tiếp theo lại có ngày trùng hoặc nhỏ hơn, hoặc thời gian rời route1 lớn hơn thời gian tới routes2
                {
                    // console.log('false 4');
                    return false;
                }
                else {
                    if (parseInt(routes1.day) === parseInt(routes2.day)) //hai route kề có day như nhau
                    {
                        if (!await check_time(routes1.leave_time, routes2.arrive_time)) //thời gian rời đi route trước là lớn hơn thời gian tới của routes sau
                        {
                            // console.log('false 5');
                            return false;
                        } else {
                            return true;
                        }
                    }
                    else {
                        if (parseInt(routes1.day) > parseInt(routes2.day)) { //routes trước có day lớn hơn routes sau
                            // console.log('false 6');
                            return false;
                        } else {
                            if (parseInt(routes1.fk_location) === parseInt(routes2.fk_location)) { //hai routes kề nhau có cùng điểm đến
                                // console.log('false 7');
                                return false
                            }
                            else {
                                if (i == length - 2 && routes2.arrive_time === null) { //routes2 là route cuối, có leave_time là null
                                    // console.log('false 8');
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

const asyncFor = async (routes, cb) => {
    for (var i = 0; i < routes.length - 1; i++) {
        if (!(await check_2_routes(i, routes[i], routes[i + 1], routes.length))) {
            cb(false);
            break;
        };
    }
}

const check_list_routes = async (routes) => {
    var result = true;
    await asyncFor(routes, (result_in_for) => {
        result = result_in_for;
    });
    return result;
}

const asyncFor_checkPassenger = async (list_passengers, arr_sex, arr_type, cb) => {
    for (let i = 0; i < list_passengers.length; i++) {
        if (typeof list_passengers[i].fullname === 'undefined' || typeof list_passengers[i].birthdate === 'undefined'
            || typeof list_passengers[i].sex === 'undefined' || typeof list_passengers[i].type === 'undefined') {
            //thiếu dữ liệu cần thiết
            cb(false);
            break;
        }
        if (list_passengers[i].phone) { //phone là không bắc buộc
            if (!await validatePhoneNumber(list_passengers[i].phone)) {
                //phone k hợp lệ
                cb(false);
                break;
            }
        }
        if (arr_sex.indexOf(list_passengers[i].sex) === -1) {
            //sex không hợp lệ
            cb(false);
            break;
        }
        if (arr_type.indexOf(list_passengers[i].type) === -1) {
            //type của passenger không tồn tại trong db
            cb(false);
            break;
        }
    }
}

const check_list_passengers = async (list_passengers, arr_sex, arr_type) => {
    if (list_passengers.length === 0) return false;
    var check = true;
    await asyncFor_checkPassenger(list_passengers, arr_sex, arr_type, (result_in_for) => {
        check = result_in_for;
    })
    return check;
}

module.exports = {
    validateEmail: validateEmail,
    validatePhoneNumber: validatePhoneNumber,
    check_time: check_time,
    check_2_routes: check_2_routes,
    check_list_routes: check_list_routes,
    check_list_passengers: check_list_passengers
}