'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        return Promise.all([
            queryInterface.sequelize.query("INSERT INTO `routes` (`id`, `arrive_time`, `leave_time`, `day`, `detail`, `title`, `fk_location`, `fk_tour`, `fk_transport`) VALUES" +
                "(1, '07:00:00', '07:30:00', 1, 'Tập trung chuẩn bị xuất phát', NULL, 27, 1, 1)," +
                "(2, '09:15:00', '10:15:00', 1, 'Di chuyển đến Dinh Độc Lập.', NULL, 22, 1, 1)," +
                "(3, '11:05:00', '11:35:00', 1, 'Tham quan Bưu điện Thành phố.', NULL, 26, 1, 1)," +
                "(4, '10:20:00', '11:00:00', 1, 'Dạo chơi ở Nhà thờ Đức Bà.', NULL, 25, 1, 1)," +
                "(5, '08:10:00', '09:00:00', 1, 'Tham quan Bảo tàng chứng tích chiến tranh trên đường Võ Văn Tần.', NULL, 16, 1, 1)," +
                "(6, '12:00:00', NULL, 1, 'Đoàn về lại điểm đón ban đầu, kết thúc hành trình.', NULL, 27, 1, 1)," +
                "(7, '08:00:00', '08:30:00', 1, 'Khởi hành từ văn phòng Viet Fun Travel bắt đầu Tour Du Lịch Tham Quan Sài Gòn 1 Ngày', NULL, 30, 2, 1)," +
                "(8, '09:10:00', '10:00:00', 1, 'Quý khách đến tham quan Bảo tàng chiến tích chiến tranh', NULL, 16, 2, 1)," +
                "(9, '10:20:00', '12:00:00', 1, 'Tham quan chùa Bà Thiên Hậu. \r\n11h20 sẽ di chuyển sang chợ Bình Tây để tham quan và ăn trưa, mua quà lưu niệm', NULL, 28, 2, 1)," +
                "(10, '13:00:00', '14:00:00', 1, 'Buổi chiều, tham quan Dinh Thống Nhất, nơi trước đây là tổng hành dinh của Mỹ đặt tại miền Nam Việt Nam.', NULL, 22, 2, 1)," +
                "(11, '14:15:00', '14:45:00', 1, 'Tham quan nhà thờ Đức Bà', NULL, 25, 2, 1)," +
                "(12, '15:00:00', '16:00:00', 1, 'Tham quan bưu điện thành phố', NULL, 26, 2, 1)," +
                "(13, '17:00:00', NULL, 1, 'Quý khách kết thúc Tour Du Lịch Tham Quan Sài Gòn 1 Ngày tại văn phòng. Chia tay quý khách và hẹn gặp lại.\r\n', NULL, 30, 2, 1)," +
                "(14, NULL, '10:00:00', 1, NULL, NULL, 51, 3, 1)," +
                "(15, '18:00:00', '06:00:00', 1, NULL, NULL, 40, 3, 1)," +
                "(16, '07:30:00', '09:00:00', 2, NULL, NULL, 31, 3, 1)," +
                "(17, '09:30:00', '11:30:00', 2, NULL, NULL, 33, 3, 1)," +
                "(18, '13:30:00', '15:30:00', 2, NULL, NULL, 32, 3, 1)," +
                "(19, '16:00:00', '18:00:00', 2, NULL, NULL, 34, 3, 1)," +
                "(20, '19:00:00', '06:00:00', 2, NULL, NULL, 40, 3, 1)," +
                "(21, '07:00:00', '08:30:00', 3, NULL, NULL, 38, 3, 1)," +
                "(22, '09:00:00', '11:00:00', 3, NULL, NULL, 35, 3, 1)," +
                "(23, '12:00:00', '14:00:00', 3, NULL, NULL, 40, 3, 1)," +
                "(24, '21:00:00', NULL, 3, NULL, NULL, 51, 3, 1)," +
                "(25, NULL, '07:30:00', 1, NULL, NULL, 57, 4, 1)," +
                "(26, '08:00:00', '09:30:00', 1, NULL, NULL, 25, 4, 1)," +
                "(27, '09:30:00', '11:30:00', 1, NULL, NULL, 26, 4, 1)," +
                "(28, '13:30:00', '15:00:00', 1, NULL, NULL, 56, 4, 1)," +
                "(29, '15:00:00', NULL, 1, NULL, NULL, 57, 4, 1)," +
                "(30, '06:30:00', '07:00:00', 1, NULL, NULL, 26, 5, 1)," +
                "(31, '14:00:00', '15:00:00', 1, NULL, NULL, 41, 5, 1)," +
                "(32, '16:00:00', '17:30:00', 1, NULL, NULL, 33, 5, 1)," +
                "(33, '18:00:00', '06:00:00', 1, NULL, NULL, 40, 5, 1)," +
                "(34, '07:30:00', '09:30:00', 2, NULL, NULL, 36, 5, 1)," +
                "(35, '10:00:00', '11:35:00', 2, NULL, NULL, 32, 5, 1)," +
                "(36, '14:00:00', '16:00:00', 2, NULL, NULL, 35, 5, 1)," +
                "(37, '16:30:00', '18:30:00', 2, NULL, NULL, 34, 5, 1)," +
                "(38, '19:00:00', '06:30:00', 2, NULL, NULL, 40, 5, 1)," +
                "(39, '08:00:00', '09:00:00', 3, NULL, NULL, 31, 5, 1)," +
                "(40, '09:30:00', '11:30:00', 3, NULL, NULL, 38, 5, 1)," +
                "(41, '14:00:00', '15:30:00', 3, NULL, NULL, 39, 5, 1)," +
                "(42, '16:30:00', '18:30:00', 3, NULL, NULL, 37, 5, 1)," +
                "(43, '19:30:00', '05:00:00', 3, NULL, NULL, 40, 5, 1)," +
                "(44, '10:00:00', '13:00:00', 4, NULL, NULL, 58, 5, 1)," +
                "(45, '13:30:00', '14:30:00', 4, NULL, NULL, 49, 5, 1)," +
                "(46, '16:00:00', '19:00:00', 4, NULL, NULL, 50, 5, 1)," +
                "(47, '20:30:00', '08:00:00', 4, NULL, NULL, 58, 5, 1)," +
                "(48, '09:00:00', '17:00:00', 5, NULL, NULL, 48, 5, 1)," +
                "(49, '16:00:00', '07:30:00', 5, NULL, NULL, 58, 5, 1)," +
                "(50, '19:00:00', NULL, 6, NULL, NULL, 26, 5, 1)," +
                "(51, NULL, '04:00:00', 1, 'di chuyển bằng đường bộ', NULL, 25, 6, 1)," +
                "(52, '09:00:00', '11:00:00', 1, 'di chuyển bằng đường bộ', NULL, 61, 6, 1)," +
                "(53, '12:00:00', '15:00:00', 1, NULL, NULL, 60, 6, 1)," +
                "(54, '18:00:00', '07:00:00', 1, NULL, NULL, 62, 6, 1)," +
                "(56, '09:00:00', '14:00:00', 2, NULL, NULL, 80, 6, 1)," +
                "(57, '15:00:00', '17:00:00', 2, NULL, NULL, 81, 6, 1)," +
                "(58, '19:00:00', '20:00:00', 2, NULL, NULL, 82, 6, 3)," +
                "(59, '21:00:00', '21:30:00', 2, NULL, NULL, 83, 6, 1)," +
                "(60, '22:30:00', '10:00:00', 2, NULL, NULL, 63, 6, 1)," +
                "(61, '11:00:00', '07:30:00', 3, NULL, NULL, 84, 6, 1)," +
                "(62, '08:30:00', '12:00:00', 4, NULL, NULL, 64, 6, 1)," +
                "(63, '17:00:00', '06:30:00', 4, NULL, NULL, 65, 6, 1)," +
                "(64, '09:00:00', '15:00:00', 5, NULL, NULL, 48, 6, 1)," +
                "(65, '19:00:00', '16:30:00', 5, NULL, NULL, 66, 6, 1)," +
                "(66, '08:00:00', '09:30:00', 6, NULL, NULL, 85, 6, 1)," +
                "(67, '10:30:00', '13:30:00', 6, NULL, NULL, 67, 6, 1)," +
                "(68, '14:30:00', '16:00:00', 6, NULL, NULL, 86, 6, 1)," +
                "(69, '17:00:00', '18:00:00', 6, NULL, NULL, 87, 6, 3)," +
                "(70, '19:00:00', '19:30:00', 6, NULL, NULL, 88, 6, 1)," +
                "(71, '20:30:00', '06:00:00', 6, NULL, NULL, 68, 6, 1)," +
                "(72, '07:00:00', '09:00:00', 7, NULL, NULL, 69, 6, 1)," +
                "(73, '10:00:00', '15:00:00', 7, NULL, NULL, 70, 6, 1)," +
                "(74, '16:30:00', '08:00:00', 7, NULL, NULL, 89, 6, 3)," +
                "(75, '10:00:00', '15:00:00', 8, NULL, NULL, 71, 6, 1)," +
                "(76, '18:00:00', '08:30:00', 8, NULL, NULL, 73, 6, 1)," +
                "(77, '10:00:00', '07:00:00', 9, NULL, NULL, 76, 6, 1)," +
                "(78, '09:00:00', '11:30:00', 10, NULL, NULL, 74, 6, 1)," +
                "(79, '15:00:00', '17:00:00', 10, NULL, NULL, 90, 6, 1)," +
                "(80, '18:00:00', '19:00:00', 10, NULL, NULL, 88, 6, 3)," +
                "(81, '07:00:00', '08:30:00', 1, NULL, NULL, 4, NULL, NULL)," +
                "(82, '09:00:00', '12:00:00', 1, NULL, NULL, 2, NULL, NULL)," +
                "(83, '14:00:00', '01:00:00', 1, NULL, NULL, 14, NULL, NULL)," +
                "(84, '02:00:00', '14:00:00', 2, NULL, NULL, 12, NULL, NULL)," +
                "(85, '05:00:00', '06:00:00', 3, NULL, NULL, 17, NULL, NULL)," +
                "(86, '07:00:00', '21:00:00', 3, NULL, NULL, 14, NULL, NULL)," +
                "(87, '06:00:00', '19:00:00', 4, NULL, NULL, 13, NULL, NULL)," +
                "(88, '08:00:00', NULL, 5, NULL, NULL, 3, NULL, NULL)," +
                "(91, '14:00:00', '01:00:00', 1, NULL, NULL, 14, NULL, NULL)," +
                "(93, '05:00:00', '06:00:00', 3, NULL, NULL, 17, NULL, NULL)," +
                "(94, '07:00:00', '21:00:00', 3, NULL, NULL, 14, NULL, NULL)," +
                "(95, '06:00:00', '19:00:00', 4, NULL, NULL, 13, NULL, NULL)," +
                "(96, '08:00:00', NULL, 5, NULL, NULL, 3, NULL, NULL);"),
            queryInterface.sequelize.query("INSERT INTO `price_passenger` (`id`, `percent`, `fk_tourturn`, `fk_type_passenger`) VALUES" +
                "(1, 100, 1, 1)," +
                "(2, 50, 1, 2)," +
                "(3, 99, 2, 1)," +
                "(4, 60, 2, 2)," +
                "(5, 100, 3, 1)," +
                "(6, 55, 3, 2)," +
                "(7, 100, 4, 1)," +
                "(8, 45, 4, 2)," +
                "(9, 99, 5, 1)," +
                "(10, 50, 5, 2)," +
                "(11, 100, 6, 1)," +
                "(12, 30, 6, 2)," +
                "(13, 97, 7, 1)," +
                "(14, 45, 7, 2)," +
                "(15, 100, 8, 1)," +
                "(16, 45, 8, 2)," +
                "(17, 100, 13, 1)," +
                "(18, 50, 13, 2)," +
                "(19, 100, 14, 1)," +
                "(21, 100, 15, 1)," +
                "(22, 50, 15, 2)," +
                "(23, 100, 16, 1)," +
                "(24, 40, 16, 2)," +
                "(25, 100, 19, 1)," +
                "(26, 40, 19, 2)," +
                "(27, 99, 17, 1)," +
                "(28, 50, 17, 2)," +
                "(29, 100, 18, 1)," +
                "(30, 50, 18, 2)," +
                "(31, 48, 14, 2)," +
                "(39, 49, 33, 2)," +
                "(40, 99, 33, 1);"),
            queryInterface.sequelize.query("INSERT INTO `book_tour_history` (`id`, `code`, `book_time`, `status`, `num_passenger`, `total_pay`, `fk_contact_info`, `fk_tour_turn`, `fk_payment`) VALUES" +
                "(3, '78acc210-5059-11e9-aa13-03259040952a', '2019-03-20 09:25:08', 'paid', 1, 1000000, 3, 14, 1)," +
                "(4, '814d77c0-5059-11e9-989c-a5f26e5408ec', '2019-03-20 09:25:19', 'booked', 1, 1000000, 4, 3, 1)," +
                "(5, '870ae3a0-5059-11e9-8684-5d74946d80db', '2019-03-20 09:27:03', 'booked', 2, 1000000, 5, 4, 1)," +
                "(6, '89216790-5059-11e9-8c7e-c3f82d1fa1ef', '2019-03-20 13:42:47', 'booked', 2, 1000000, 6, 14, 1)," +
                "(7, '8fae3160-5059-11e9-98a6-11c33d1f98b4', '2019-03-21 14:32:24', 'cancelled', 3, 1500000, 7, 14, 1)," +
                "(8, 'a294e850-5059-11e9-8e50-6d47d5b38a8f', '2019-03-27 06:29:12', 'booked', 3, 1500000, 8, 14, 1);"),
            queryInterface.sequelize.query("INSERT INTO `passengers` (`id`, `fullname`, `phone`, `birthdate`, `sex`, `passport`, `fk_book_tour`, `fk_type_passenger`) VALUES" +
                "(3, 'Nguyển Văn A', '0123456789', '1997-11-24', 'male', NULL, 3, 1)," +
                "(4, 'Thái Bá Long', '0123456789', '1997-11-24', 'male', '206120720', 4, 1)," +
                "(5, 'Thái Bá Long', '0123456789', '1997-11-24', 'male', NULL, 5, 1)," +
                "(6, 'Ngọc Trinh', '0123451489', '1997-04-10', 'female', NULL, 5, 1)," +
                "(7, 'Thái Bá Long', '0123456789', '1997-11-24', 'male', '206120720', 6, 1)," +
                "(8, 'Sawa', '0123451489', '1997-09-12', 'female', NULL, 6, 1)," +
                "(9, 'Phạm Hưng Tuấn Anh', '0125466454', '1997-08-21', 'male', '206124151', 7, 1)," +
                "(10, 'Nguyễn Ngọc Minh', '0164651846', '1997-04-05', 'female', NULL, 7, 1)," +
                "(11, 'Phạm Hưng Ngọc Minh', '0125466454', '2012-04-05', 'female', NULL, 7, 2)," +
                "(12, 'Phạm Hưng Ta', '0125466447', '1997-08-21', 'male', '206447583', 8, 1)," +
                "(13, 'Nguyễn Thị Minh', '0167551846', '1997-04-05', 'female', NULL, 8, 1)," +
                "(14, 'Phạm Thị Ngọc', '0125466447', '2012-07-06', 'female', NULL, 8, 2);"),
        ])
    },
    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return Promise.all([
            queryInterface.bulkDelete('routes', null, {}),
            queryInterface.bulkDelete('price_passenger', null, {}),
            queryInterface.bulkDelete('passengers', null, {}),
            queryInterface.bulkDelete('book_tour_history', null, {}),
        ])
    }
};
