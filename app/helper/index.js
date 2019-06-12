exports.slugify = (str) => {
    if (!str || str == '') {
        return 'unknown'
    }
    str = str
        .toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '')
    if (!str || str == '') {
        return 'u';
    }
    return str;
}

const arr_days_of_week = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba',
    'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

exports.toStringDatetime = (date) => {
    var ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    let hour = date.getHours();
    if (hour < 10) hour = '0' + hour
    let min = date.getMinutes();
    if (min < 10) min = '0' + min
    return hour + ':' + min + ' ' + ampm + ' ' + arr_days_of_week[date.getDay()] + ', ' + date.getDate() + ' Thg ' + (date.getMonth() + 1) + ' ' + date.getFullYear();
}

exports.toStringDate = (date) => {
    return arr_days_of_week[date.getDay()] + ', ' + date.getDate() + ' Thg ' + (date.getMonth() + 1) + ' ' + date.getFullYear();
}

exports.formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

exports.convertListRoutes = async (routes) => {
    const result_routes = [];
    for (let i = 0, l = routes.length; i < l; i++) {
        if (typeof result_routes[routes[i].day - 1] === 'undefined') {
            result_routes.push({
                day: routes[i].day,
                list_routes: [routes[i]],
                list_province: [routes[i].location.province.name]
            })
        }
        else {
            result_routes[routes[i].day - 1].list_routes.push(routes[i]);
            if (result_routes[routes[i].day - 1].list_province.indexOf(routes[i].location.province.name) < 0)
                result_routes[routes[i].day - 1].list_province.push(routes[i].location.province.name)
        }

    }
    return result_routes;
}
