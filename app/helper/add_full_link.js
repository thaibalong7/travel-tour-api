const link_img = require('../config/config').link_img

const addLinkToursFeaturedImgOfListTours = async (tours, host) => {
    return tours.map(item => {
        if (item.featured_img !== null) {
            if (process.env.NODE_ENV === 'development')
                item.featured_img = 'http://' + host + link_img.link_tour_featured + item.featured_img
            else
                item.featured_img = 'https://' + host + link_img.link_tour_featured + item.featured_img
        }
        return item;
    })
}

const addLinkToursFeaturedImgOfListTourTurns = async (tour_turns, host) => {
    return tour_turns.map(item => {
        if (item.tour.featured_img !== null) {
            if (process.env.NODE_ENV === 'development')
                item.tour.featured_img = 'http://' + host + link_img.link_tour_featured + item.tour.featured_img
            else
                item.tour.featured_img = 'https://' + host + link_img.link_tour_featured + item.tour.featured_img
            return item;
        }
        return item;
    })
}

const addLinkLocationFeaturedImgOfListRoutes = async (_routes, host) => {
    return _routes.map(item => {
        if (item.location.featured_img === null) {
            // item.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
            return item;
        }
        else {
            if (process.env.NODE_ENV === 'development')
                item.location.featured_img = 'http://' + host + link_img.link_location_featured + item.location.featured_img;
            else
                item.location.featured_img = 'https://' + host + link_img.link_location_featured + item.location.featured_img;
            return item;
        }
    })
}

const addLinkTourImgOfListToursImg = async (_tour_image, host) => {
    return _tour_image.map(item => {
        //chắc chắn dữ liệu luôn đúng
        if (process.env.NODE_ENV === 'development')
            item.name = 'http://' + host + link_img.link_tour_img + item.name
        else
            item.name = 'https://' + host + link_img.link_tour_img + item.name;
        return item;
    })
}


const addLinkLocationFeaturedImgOfListLocations = async (_locations, host) => {
    return _locations.map(item => {
        if (item.featured_img === null) {
            // item.featured_img = host + '/assets/images/locationDefault/' + item.fk_type + '.jpg';
            return item;
        }
        else {
            if (process.env.NODE_ENV === 'development')
                item.featured_img = 'http://' + host + link_img.link_location_featured + item.featured_img;
            else
                item.featured_img = 'https://' + host + link_img.link_location_featured + item.featured_img;
            return item;
        }
    })
}

const addLinkAvatarUserOfListComment = async (_comments, host) => {
    return _comments.map(item => {
        if (!item.user.avatar) {
            return item;
        }
        else {
            if (process.env.NODE_ENV === 'development')
                item.user.avatar = 'http://' + host + link_img.link_avatar_user + item.user.avatar;
            else
                item.user.avatar = 'https://' + host + link_img.link_avatar_user + item.user.avatar;
            return item;
        }
    })
}

module.exports = {
    addLinkLocationFeaturedImgOfListLocations,
    addLinkLocationFeaturedImgOfListRoutes,
    addLinkTourImgOfListToursImg,
    addLinkToursFeaturedImgOfListTours,
    addLinkToursFeaturedImgOfListTourTurns,
    addLinkAvatarUserOfListComment
}