var config = {
    link_img: {
        link_location_featured: '/assets/images/locationFeatured/',
        link_tour_featured: '/assets/images/tourFeatured/',
        link_tour_img: '/assets/images/tourImage/',
        link_avatar_user: '/assets/avatar/'
    },
    smtpConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL / true for 465, false for other ports
        auth: {
            user: "travel.tour.k15@gmail.com",
            pass: "traveltour123456789"
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    company_info: {
        name: 'Tour Travel',
        address: '127 Nguyễn Văn Cừ, Quận 5, TP Hồ Chí Minh'
    }
}

module.exports = config