
const check_time = async (arrive, leave) => {
    return Date.parse('01/01/2011 ' + arrive) < Date.parse('01/01/2011 ' + leave)
}

const check_2_routes = async (i, routes1, routes2) => {
    if (i !== 1 && (routes1.arriveTime === null || routes1.leaveTime === null)) //k phải route đầu tiên và có thời gian là null
    {
        return false;
    }
    else {
        if (((await check_time(routes1.arriveTime, routes1.leaveTime)) === false) && (parseInt(routes2.day) <= parseInt(routes1.day) || check_time(routes1.leaveTime, routes2.arriveTime))) //thời gian rời khỏi là ngày hôm sau nhưng route tiếp theo lại có ngày trùng hoặc nhỏ hơn, hoặc thời gian rời route1 lớn hơn thời gian tới routes2
        {
            return false;
        }
        else {
            if (parseInt(routes1.day) === parseInt(routes2.day)) //hai route kề có day như nhau
            {
                if (!await check_time(routes1.leaveTime, routes2.arriveTime)) //thời gian rời đi route trước là lớn hơn thời gian tới của routes sau
                {
                    return false;
                } else {
                    return true;
                }
            }
            else {
                if (parseInt(routes1.day) > parseInt(routes2.day)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
}

const asyncFor = async (routes, cb) => {
    for (var i = 0; i < routes.length - 2; i++) {
        if (!(await check_2_routes(i, routes[i], routes[i + 1]))) {
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

module.exports = {
    validateEmail: async function (email) {
        var Regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/
        return Regex.test(email);
    },
    validatePhoneNumber: async function (phone_number) {
        var Regex = /^\d{10}$/
        return Regex.test(phone_number);
    },
    check_time: check_time,
    check_2_routes: check_2_routes,
    check_list_routes: check_list_routes
}