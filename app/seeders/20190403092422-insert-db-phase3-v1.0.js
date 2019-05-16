'use strict';

function formatDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days)
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

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
                "(14, NULL, '10:00:00', 1, 'Tập trung trước 2 tiếng để chuẩn bị khởi hành', NULL, 51, 3, 1)," +
                "(15, '18:00:00', '06:00:00', 1, 'Tới khách sạn và ở lại qua đêm', NULL, 40, 3, 1)," +
                "(16, '07:30:00', '09:00:00', 2, 'Tham quan nhà thờ Con Gà', NULL, 31, 3, 1)," +
                "(17, '09:30:00', '11:30:00', 2, 'Du ngoạn bằng cáp treo trước khi tới Thiền viên Trúc Lâm', NULL, 33, 3, 1)," +
                "(18, '13:30:00', '15:30:00', 2, 'Thăm quan dinh tự cổ của vị vua cuối cùng của Việt Nam - vua Bảo Đại', NULL, 32, 3, 1)," +
                "(19, '16:00:00', '18:00:00', 2, 'Thăm quan Showroom hoa nghệ thuật', NULL, 34, 3, 1)," +
                "(20, '19:00:00', '06:00:00', 2, 'Quay về khách sạn nghỉ ngơi, chuẩn bị cho ngày tiếp theo', NULL, 40, 3, 1)," +
                "(21, '07:00:00', '08:30:00', 3, 'Tham quan Ga xe lửa Thành phố', NULL, 38, 3, 1)," +
                "(22, '09:00:00', '11:00:00', 3, 'Thăm quan làng hoa Vạn Thành', NULL, 35, 3, 1)," +
                "(23, '12:00:00', '14:00:00', 3, 'Quay về khách sạn nghỉ ngơi, qua đêm, chuẩn bị quay về Vũng Tàu', NULL, 40, 3, 1)," +
                "(24, '21:00:00', NULL, 3, 'Di chuyển về Vũng Tàu, kết thúc chuyến đi', NULL, 51, 3, 1)," +
                "(25, NULL, '07:30:00', 1, 'Tập trung tại cổng trường ĐH Khoa học tự nhên trước 45 phút để chuẩn bị xuất phát', NULL, 57, 4, 1)," +
                "(26, '08:00:00', '09:30:00', 1, 'Thăm quan nhà thờ Đức Bà thành phố', NULL, 25, 4, 1)," +
                "(27, '09:30:00', '11:30:00', 1, 'Di chuyển sang Bưu điện Trung tâm thành phố ở gần đó', NULL, 26, 4, 1)," +
                "(28, '13:30:00', '15:00:00', 1, 'Thăm quan Nhà hát TP Hồ Chí Minh', NULL, 56, 4, 1)," +
                "(29, '15:00:00', NULL, 1, 'Quay về trường ĐH Khoa học tự nhiên, kết thúc chuyến đi.', NULL, 57, 4, 1)," +
                "(30, '06:30:00', '07:00:00', 1, 'Tập trung ở Bưu điện Trung tâm trước 1 giờ để chuẩn bị khởi hành', NULL, 26, 5, 1)," +
                "(31, '14:00:00', '15:00:00', 1, 'Tới Đà Lạt, thác Prenn là địa điểm tham quan đầu tiên trong chuyến hành trình', NULL, 41, 5, 1)," +
                "(32, '16:00:00', '17:30:00', 1, 'Tham quan Thiền viện Trúc Lâm', NULL, 33, 5, 1)," +
                "(33, '18:00:00', '06:00:00', 1, 'Về khách sạn, làm thủ tục, phân chia phòng. Ăn tối tại đây. Nghỉ ngơi chuẩn bị cho chuyến đi ngày mới', NULL, 40, 5, 1)," +
                "(34, '07:30:00', '09:30:00', 2, 'Tham quan Thung Lũng Vàng', NULL, 36, 5, 1)," +
                "(35, '10:00:00', '11:35:00', 2, 'Tham quan Dinh Bảo Đại, sau đó di chuyển ra một nơi gần đó để ăn trưa.', NULL, 32, 5, 1)," +
                "(36, '14:00:00', '16:00:00', 2, 'Tham quan làng hoa Vạn Thành', NULL, 35, 5, 1)," +
                "(37, '16:30:00', '18:30:00', 2, 'Thăm quan Showroom hoa nghệ thuật ', NULL, 34, 5, 1)," +
                "(38, '19:00:00', '06:30:00', 2, 'Về lại khách sạn, ăn tối và nghỉ ngơi. Mọi người được tự đi lại', NULL, 40, 5, 1)," +
                "(39, '08:00:00', '09:00:00', 3, 'Tham quan Nhà thờ Con Gà', NULL, 31, 5, 1)," +
                "(40, '09:30:00', '11:30:00', 3, 'Tham quan Ga xe lửa, sau đó hành khách tự do đi lại ở siêu thị Big C thành phố và ăn trưa.', NULL, 38, 5, 1)," +
                "(41, '14:00:00', '15:30:00', 3, 'Tham quan chùa Linh Thước', NULL, 39, 5, 1)," +
                "(42, '16:30:00', '18:30:00', 3, 'Di chuyển lên đỉnh Langbiang, quý khách có thể leo núi, chụp ảnh thiên nhiên hùng vĩ tại đây.', NULL, 37, 5, 1)," +
                "(43, '19:30:00', '05:00:00', 3, 'Về lại khách sạn, ăn tối và nghỉ ngơi. Chuẩn bị để di chuyển tới Đà Nẵng ngày hôm sau. Hãy ngủ dậy lúc 4h để chuẩn bị', NULL, 40, 5, 1)," +
                "(44, '10:00:00', '13:00:00', 4, 'Tới khách sạn ở Đà Nẵng, quý khách được nghỉ ngơi một vài tiếng trước khi lên đường tham quan tiếp.', NULL, 58, 5, 1)," +
                "(45, '13:30:00', '14:30:00', 4, 'Tham quan bảo tàng 3D TrickEye', NULL, 49, 5, 1)," +
                "(46, '16:00:00', '19:00:00', 4, 'Di chuyển vào Hội An cách Đà Nẵng 15km, quý khách tự do đi lại ở phố cổ Hội An cũng như tự do lựa chọn món ăn cho bữa tối tại đây.', NULL, 50, 5, 1)," +
                "(47, '20:30:00', '08:00:00', 4, 'Quay về khách sạn nghỉ ngơi.', NULL, 58, 5, 1)," +
                "(48, '09:00:00', '17:00:00', 5, 'Tham quan Bà Nà Hill, quý khách được trải nghiệm tất cả những dịch vụ ở khu Bà Nà. Quý khách có thể tự do đi lại sau khi ăn trưa tại đây.', NULL, 48, 5, 1)," +
                "(49, '16:00:00', '07:30:00', 5, 'Về lại khách sạn. Chuẩn bị quay về Hồ Chí Minh', NULL, 58, 5, 1)," +
                "(50, '19:00:00', NULL, 6, 'Kết thúc chuyến đi, quý khách tự do di chuyển', NULL, 26, 5, 1)," +
                "(51, NULL, '04:00:00', 1, 'Đoàn khởi hành rời TP.Hồ Chí Minh đi Nha Trang', NULL, 25, 6, 1)," +
                "(52, '09:00:00', '11:00:00', 1, 'Trên đường ghé Phan Thiết, du khách dừng chân nghỉ ngơi và ngắm biển Đồi Dương. Ghé tham quan bãi biển Cà Ná – nơi giao hoà tuyệt đẹp giữa núi và biển', NULL, 61, 6, 1)," +
                "(53, '12:00:00', '15:00:00', 1, 'Đoàn đi theo đường mới ven biển Sông Lô – Hòn Rớm ngắm cảnh biển tuyệt vời trên Vịnh Cam Ranh. Đoàn vào Nha Trang theo con đường mới ven biển Sông Lô – Hòn Rớ, qua đèo Cù Huân ngắm cảnh biển chiều trên vịnh Nha Trang', NULL, 60, 6, 1)," +
                "(54, '18:00:00', '07:00:00', 1, 'Đến Nha Trang (tỉnh Khánh Hòa) đoàn thưởng thức tiệc Buffet tối đặc biệt, sau đó về khách sạn. Buổi tối, xe đưa Quý khách đi dạo phố biển về đêm, qua chợ đêm Nha Trang, công viên Phù Đổng, Cà phê Bốn Mùa, khu hải sản Tháp Bà… Nghỉ đêm tại Nha Trang. (Ăn sáng trưa, chiều, tối).', NULL, 62, 6, 1)," +
                "(56, '09:00:00', '14:00:00', 2, 'Xe đưa đoàn khởi hành đi Dốc Lết, trên đường Quý khách  thưởng ngoạn các thắng cảnh nổi tiếng Nha Trang như: cầu Xóm Bóng, núi Cô Tiên, Hòn Chồng... Đến với bãi biển White Sand - Dốc Lết, một trong những bãi biển đẹp nổi tiếng của Khánh Hòa với bãi cát trắng thoai thoải trãi dài cùng làn nước trong xanh và hàng dừa nghiêng mình soi bóng,  Quý khách tắm biển và thưởng thức các món hải sản của ngư dân địa phương đánh bắt', NULL, 80, 6, 1)," +
                "(57, '15:00:00', '17:00:00', 2, 'Đoàn đi tham quan Trung tâm Ngọc Trai Long Beach Pearl Nha Trang, là một trong hai trung tâm Ngọc Trai lớn nhất khu vực miền trung do tập đoàn Long Beach Pearl đầu tư. Đến đây Quý khách được nghe giới thiệu về qui trình nuôi cấy - khai thác - chế tác ngọc trai, được tham quan khu trưng bày với hơn 3.000 mẫu ngọc trai thiết kế tinh tế - đẹp mắt và sang trọng', NULL, 81, 6, 1)," +
                "(58, '19:00:00', '20:00:00', 2, 'Tối khuya Đoàn ra sân bay Cam Ranh làm thủ tục bay Đà Nẵng.', NULL, 82, 6, 3)," +
                "(59, '21:00:00', '21:30:00', 2, 'Tới Đà Nẵng và về khách sạn nghỉ ngơi.', NULL, 83, 6, 1)," +
                "(60, '22:30:00', '10:00:00', 2, 'Quý khách nghỉ ngơi ở khách sạn để chuẩn bị các chuyến đi vào ngày hôm sau', NULL, 63, 6, 1)," +
                "(61, '11:00:00', '07:30:00', 3, 'Lên Bán Đảo Sơn Trà mục kích phố biển Đà Nẵng trên cao, viếng Linh Ứng Tự - nơi có tượng Phật Bà 67m cao nhất Việt Nam và tắm biển Mỹ Khê Đà Nẵng. Ăn tối nhà hàng. Trãi nghiệm cảm giác với Vòng quay Mặt trời SUN WHEEL – Top 10 vòng quay cao nhất Thế Giới, chiêm ngưởng vẻ đẹp Đà Thành về đêm rực rỡ ánh đèn. (Vé Sun Wheel tự túc). Nghỉ đêm tại Bán Đảo Sơn Trà.', NULL, 84, 6, 1)," +
                "(62, '08:30:00', '12:00:00', 4, 'Tiếp tục tham quan Ngũ Hành Sơn - Khám phá các hang động, vãn cảnh đẹp non nước trời mây', NULL, 64, 6, 1)," +
                "(63, '17:00:00', '06:30:00', 4, 'Khởi hành vào Hội An bách bộ tham quan và mua sắm Phố Cổ với: Chùa Cầu Nhật Bản, Nhà Cổ hàng trăm năm tuổi, Hội Quán Phước Kiến & Xưởng thủ công mỹ nghệ.  Ăn tối Đặc sản Hội An: Cao lầu, bánh bao bánh vạc, hoành thánh, .. Nghỉ đêm tại Phố Cổ', NULL, 65, 6, 1)," +
                "(64, '09:00:00', '15:00:00', 5, 'Khởi hành lên Bà Nà 9h00 sáng: Đến ga cáp treo Suối Mơ, lên tuyến cáp treo đạt 4 kỷ lục thế giới. 9h30 sáng: Tham quan Cầu vàng - Cây cầu độc đáo nằm trong vườn Thiên Thai ở Bà Nà Hill. Tham quan Khu Le Jardin, tham quan Hầm Rượu Debay của Pháp. Viếng Chùa Linh Ứng Bà Nà, chiêm ngưỡng tượng Phật Thích Ca cao 27m, Vườn Lộc Uyển, Quan Âm Các. Tiếp tục đến Gare Debay đi tuyến cáp thứ 2 lên đỉnh Bà Nà. Hướng dẫn đưa đoàn vào tham quan khu vui chơi Fantasy Park tham gia các trò chơi phiêu lưu mới lạ, ngộ nghĩnh, hấp dẫn, hiện đại như vòng quay tình yêu, Phi công Skiver, Đường đua lửa, Xe điện đụng Ngôi nhà ma. Khởi hành đi Cố Đô Huế - Di sản văn hoá Thế Giới, xuyên hầm đường bộ đèo Hải Vân, dừng chân tại làng chài Lăng Cô chụp hình lưu niệm', NULL, 48, 6, 1)," +
                "(65, '19:00:00', '16:30:00', 5, 'Khởi hành đi Cố Đô Huế - Di sản văn hoá Thế Giới, xuyên hầm đường bộ đèo Hải Vân, dừng chân tại làng chài Lăng Cô chụp hình lưu niệm.Tham quan Lăng Khải Định - công trình mang nhiều trường phái kiến trúc khác nhau, kết hợp Đông - Tây, Âu - Á, Cổ Kim độc đáo so với các công trình kiến trúc truyền thống Việt Nam. Nhận phòng khách sạn nghỉ ngơi', NULL, 66, 6, 1)," +
                "(66, '08:00:00', '09:30:00', 6, 'Tham quan thánh địa La Vang', NULL, 85, 6, 1)," +
                "(67, '10:30:00', '13:30:00', 6, 'Ngồi thuyền ngược sông Son chinh phục Động Phong Nha: Cô Tiên & Cung Đình dưới sâu lòng núi nơi có con sông ngầm từ Lào chảy sang, chiêm ngưỡng các khối thạch nhũ tuyệt đẹp được kiến tạo bởi thiên nhiên qua hàng ngàn thiên niên kỷ.', NULL, 67, 6, 1)," +
                "(68, '14:30:00', '16:00:00', 6, 'Khởi hành về Huế để chiêm ngưỡng vẻ đẹp của Kinh Thành Huế. ', NULL, 86, 6, 1)," +
                "(69, '17:00:00', '18:00:00', 6, 'Xe đến đón quý khách ra sân bay khởi hành đi Hà Nội. ', NULL, 87, 6, 3)," +
                "(70, '19:00:00', '19:30:00', 6, 'Tới Hà Nội', NULL, 88, 6, 1)," +
                "(71, '20:30:00', '06:00:00', 6, 'Nhận phòng, ăn tối và nghỉ ngơi qua đêm.', NULL, 68, 6, 1)," +
                "(72, '07:00:00', '09:00:00', 7, 'Xe khởi hành đi Ninh Bình, ngắm cảnh vùng nông thôn Việt Nam. Đến Ninh Bình, Quý khách ghé thăm Cố đô Hoa Lư - Kinh đô của nước ta vào thế kỷ X - nơi có hai ngôi đền thờ vua Đinh và vua Lê.', NULL, 69, 6, 1)," +
                "(73, '10:00:00', '15:00:00', 7, 'Đoàn khởi hành đi Hạ long – Di sản thế giới được UNESCO công nhận năm 1994, thăm quan động Thiên Cung và hang Dấu Gỗ, đi qua Hòn Lư Hương, Hòn Gà Chọi, Hòn Chó Đá, (Dùng cơm trưa trên tàu trước khi thăm quan hang động).', NULL, 70, 6, 1)," +
                "(74, '16:30:00', '08:00:00', 7, 'Tự do hoặc vui chơi tại công viên Hoàng Gia – Nghỉ đêm tại khách sạn Hạ Long.', NULL, 89, 6, 3)," +
                "(75, '10:00:00', '15:00:00', 8, 'Hướng dẫn viên đón đoàn khởi hành đi Yên Tử. Đến Yên Tử, Quý khách leo núi khám phá vẻ đẹp tự nhiên của núi Yên Tử – còn được gọi là Bạch Vân Sơn (núi giữa mây trắng) cao hơn 1000m. Nghỉ ngơi, ăn trưa, lễ chùa tại khu vực Hoa Yên. Quý khách tiếp tục leo núi, chinh phục chặng đường khó khăn nhất của núi rừng Yên Tử mà đỉnh cao nhất là chùa Đồng (nằm ở độ cao 1068m so với mặt nước biển), lễ Phật và thưởng ngoạn cảnh đại ngàn Yên Tử từ trên đỉnh núi. Quý khách leo núi trở xuống chùa Hoa Yên. Đi cáp treo (vé tự túc) ngắm nhìn cảnh đẹp của Yên Tử từ trên cao với những chặng đường đã đi qua. Xe đón quý khách lên tàu đi Lào Cai.', NULL, 71, 6, 1)," +
                "(76, '18:00:00', '08:30:00', 8, 'Tới khách sạn Lào Cai, quý khách nghỉ ngơi để chuẩn bị cho hôm sau.', NULL, 73, 6, 1)," +
                "(77, '10:00:00', '07:00:00', 9, 'Tàu tới ga Lào Cai, xe ôtô đón quý khách lên Bản Cát Cát (Sapa),tìm hiểu về lối sống và phong tục của người H’Mông (đi bằng xe ôtô riêng) thăm nhà máy thuỷ điện từ thời Pháp thuộc, thăm trường học và nhà ở của đồng bào dân tộc thiểu số, kỹ thuật nhuộm chàm của người H’Mông, tự do dạo chơi. Quý khách nghỉ đêm tại Bản Cát Cát.', NULL, 76, 6, 1)," +
                "(78, '09:00:00', '11:30:00', 10, 'Quý khách đi thăm Hàm Rồng (đi bộ) để ngắm cảnh thị trấn Sapa và khám phá hàng trăm loại phong lan, cây cảnh mà chỉ ở nơi đây mới có. Quý khách tự do dạo chơi, đi chợ Sapa tham quan và mua quà lưu niệm. Lên tàu đêm về Hà Nội', NULL, 74, 6, 1)," +
                "(79, '15:00:00', '17:00:00', 10, 'Đoàn đi viếng Lăng Bác: phủ Chủ Tịch, vườn cây ao cá, nhà sàn Bác Hồ, chùa Một Cột.', NULL, 90, 6, 1)," +
                "(80, '18:00:00', '19:00:00', 10, 'Xe đưa du khách ra sân bay chia tay. Kết thúc Tour Du Lich Xuyên Việt Miền Nam - Miền Bắc 10 Ngày và hẹn tái ngộ.', NULL, 88, 6, 3)," +
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
                "(53, 100, 20, 1)," +
                "(54, 48, 20, 2)," +
                "(55, 100, 21, 1)," +
                "(56, 50, 21, 2)," +
                "(39, 49, 33, 2)," +
                "(40, 99, 33, 1);"),
            queryInterface.sequelize.query("INSERT INTO `book_tour_history` (`id`, `code`, `book_time`, `status`, `num_passenger`, `total_pay`, `fk_contact_info`, `fk_tour_turn`, `fk_payment`) VALUES" +
                "(3, '78acc210-5059-11e9-aa13-03259040952a', '" + formatDate(-5) + " 09:25:08', 'paid', 1, 1000000, 3, 14, 1)," +
                "(4, '814d77c0-5059-11e9-989c-a5f26e5408ec', '" + formatDate(-3) + " 09:25:19', 'booked', 1, 1000000, 4, 3, 1)," +
                "(5, '870ae3a0-5059-11e9-8684-5d74946d80db', '" + formatDate(-3) + " 09:27:03', 'booked', 2, 1000000, 5, 4, 2)," + //tới hạn nhắc nhỡ gọi điện 
                "(6, '89216790-5059-11e9-8c7e-c3f82d1fa1ef', '" + formatDate(-15) + " 13:42:47', 'booked', 2, 1000000, 6, 14, 1)," +
                "(7, '8fae3160-5059-11e9-98a6-11c33d1f98b4', '" + formatDate(-15) + " 14:32:24', 'refunded', 3, 1500000, 7, 14, 1)," + //cancel đã nhận được tiền
                "(9, '8fae3160-5059-11e9-98a6-11c3f5dd44b4', '" + formatDate(-9) + " 19:18:24', 'cancelled', 1, 550000, 9, 19, 3)," + //tour turn đang đi
                "(10, '8ssw3160-5059-11e9-98a6-w6c3f5dd44b4', '" + formatDate(-19) + " 08:18:24', 'paid', 2, 1000000, 10, 19, 1)," + //tour turn đang đi
                "(11, '55ff4160-5059-11e9-8ea6-11c355d7s8b4', '" + formatDate(-30) + " 15:04:00', 'finished', 1, 530000, 11, 20, 1)," + //tour đã đi
                "(12, '55ff4160-d44s-11e9-8ea6-4ss5w5d7s8b4', '" + formatDate(-38) + " 17:57:00', 'finished', 2, 780000, 12, 20, 2)," + //tour đã đi
                "(13, '522s4160-5059-11e9-8ea6-4ss55d4s55e4', '" + formatDate(-28) + " 04:17:00', 'booked', 1, 500000, 13, 16, 1)," + //tới hạn nhắc nhỡ gọi điện 
                "(14, '115d4160-5059-11e9-8ea6-4ss55d4s55e4', '" + formatDate(-22) + " 09:25:00', 'paid', 5, 1500000, 14, 16, 2)," +
                "(15, '1144s160-5s59-11e9-8ea6-4s55s44s55e4', '" + formatDate(-14) + " 16:37:00', 'booked', 1, 200000, 15, 3, 2)," +
                "(16, '1144s160-5s59-11e9-8ea6-4s5sdd55e4', '" + formatDate(-18) + " 05:15:00', 'confirm_cancel', 2, 400000, 16, 3, 1)," +
                "(17, '11444d60-5s59-11e9-8ea6-4sddf55ef4', '" + formatDate(-24) + " 17:14:00', 'not_refunded', 1, 3000000, 17, 7, 2)," + //không thèm nhận tiền hoàn trả
                "(18, '15ss4d60-5s59-11e9-8ea6-4sddf55ef4', '" + formatDate(-19) + " 16:08:00', 'confirm_cancel', 1, 3000000, 18, 7, 1)," + //ng nhà tới cty xin hủy giùm
                "(19, '15ss4d60-5s59-11e9-8ea6-41dds55ef4', '" + formatDate(-19) + " 09:28:00', 'paid', 1, 300000, 19, 18, 3)," + //book tour gần tới ngày đi
                "(20, '15ss4d60-3dd5g-11e9-8ea6-41dds55ef4', '" + formatDate(-28) + " 08:35:00', 'refunded', 1, 500000, 20, 20, 1)," + //book tour đã xin hủy khi gần tới ngày đi
                "(8, 'a294e850-5059-11e9-8e50-6d47d5b38a8f', '" + formatDate(-11) + " 06:29:12', 'booked', 3, 1500000, 8, 14, 1);").then(
                    () => {
                        return queryInterface.sequelize.query("INSERT INTO `passengers` (`id`, `fullname`, `phone`, `birthdate`, `sex`, `passport`, `fk_book_tour`, `fk_type_passenger`) VALUES" +
                            "(3, 'Nguyển Văn A', '0123456789', '1997-11-24', 'male', '210012234', 3, 1)," +
                            "(4, 'Thái Bá Long', '0123456789', '1997-11-24', 'male', '206120720', 4, 1)," +
                            "(5, 'Thái Bá Long', '0123456789', '1997-11-24', 'male', '206120720', 5, 1)," +
                            "(6, 'Ngọc Trinh', '0123451489', '1997-04-10', 'female', '214455648', 5, 1)," +
                            "(7, 'Thái Bá Long', '0123456789', '1997-11-24', 'male', '206120720', 6, 1)," +
                            "(8, 'Sawa', '0123451489', '1997-09-12', 'female', '311445557', 6, 1)," +
                            "(9, 'Phạm Hưng Tuấn Anh', '0125466454', '1997-08-21', 'male', '206124151', 7, 1)," +
                            "(10, 'Nguyễn Ngọc Minh', '0164651846', '1997-04-05', 'female', '222454562', 7, 1)," +
                            "(11, 'Phạm Hưng Ngọc Minh', '0125466454', '2012-04-05', 'female', NULL, 7, 2)," +
                            "(12, 'Phạm Hưng Ta', '0125466447', '1997-08-21', 'male', '206447583', 8, 1)," +
                            "(13, 'Nguyễn Thị Minh', '0167551846', '1997-04-05', 'female', '332130132', 8, 1)," +
                            "(15, 'Nguyễn Văn A', '0364651849', '1995-01-05', 'male', '265654364', 9, 1)," +
                            "(16, 'Phạm Hữu Tình', '0333154548', '1990-07-27', 'male', '155468478', 10, 1)," +
                            "(17, 'Lý Thị Ngọc', '0115464874', '1992-08-17', 'female', '123334568', 10, 1)," +
                            "(18, 'Nguyễn Thị Phùng', '0334554871', '1992-11-04', 'female', '988842154', 11, 1)," +
                            "(19, 'Phạm Ngọc Tình', '0334548742', '1997-04-04', 'male', '111321546', 12, 1)," +
                            "(20, 'Phạm Thị Sen', '0345451876', '2010-11-04', 'female', NULL, 12, 2)," +
                            "(21, 'Trương Minh Sang', '0754487564', '1989-08-04', 'male', '445654845', 13, 1)," +
                            "(22, 'Lê Thanh Thảo', '0345545484', '1989-07-11', 'male', '121354684', 14, 1)," +
                            "(23, 'Lê Thanh Thúy', '0334646554', '1990-04-03', 'female', '122021021', 14, 1)," +
                            "(24, 'Hồ Quý Phượng', '0346642718', '1990-11-25', 'female', '300231254', 14, 1)," +
                            "(25, 'Mai Quang Tiến', '0316422754', '1992-07-14', 'male', '023232535', 14, 1)," +
                            "(26, 'Vinh Râu', '0776452841', '1985-04-09', 'male', '213215465', 14, 1)," +
                            "(27, 'Phạm Thành Long', '0315549987', '1983-01-27', 'male', '465156486', 15, 1)," +
                            "(28, 'Lee Ngọc Hồi', '0345444878', '1989-01-09', 'male', '031154877', 16, 1)," +
                            "(29, 'Hồ Thanh Hằng', '0311889987', '1988-01-17', 'female', '154548487', 16, 1)," +
                            "(30, 'Lê Văn Hải', '0102521548', '1997-02-06', 'male', '211548876', 17, 1)," +
                            "(31, 'Trần Văn Kiên', '0344578451', '1988-09-30', 'male', '254549542', 18, 1)," +
                            "(32, 'Nguyễn Trần Trung Kiên', '0346665442', '1987-12-05', 'male', '206664551', 19, 1)," +
                            "(33, 'Võ Văn Thanh', '0346665452', '1992-08-30', 'male', '322154460', 20, 1)," +
                            "(14, 'Phạm Thị Ngọc', '0125466447', '2012-07-06', 'female', '332654865', 8, 2);")
                    }
                ),
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
