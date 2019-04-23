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
			queryInterface.sequelize.query("INSERT INTO `types` (`id`, `name`, `marker`) VALUES" +
				"(1, 'Quán ăn - Nhà hàng', 'restaurant')," +
				"(2, 'Khu vui chơi giải trí', 'amusement')," +
				"(3, 'Chợ', 'market')," +
				"(4, 'Chợ đêm', 'marketnight')," +
				"(5, 'Cafe - Trà sữa', 'cafe_and_milk_tea')," +
				"(6, 'Trạm xe buýt', 'bus_stop')," +
				"(7, 'Cây xăng', 'gas_station')," +
				"(8, 'Khu mua sắm - Trung tâm thương mại', 'mall')," +
				"(9, 'Thể thao', 'sport')," +
				"(10, 'Công an', 'police')," +
				"(11, 'Bệnh viện', 'hospital')," +
				"(12, 'Ngân hàng', 'bank')," +
				"(13, 'Nhà thờ', 'church')," +
				"(14, 'Khách sạn', 'hotel')," +
				"(15, 'Bảo tàng', 'museum')," +
				"(16, 'Công viên', 'park')," +
				"(17, 'Điểm thu hút khách du lịch', 'tourist_area')," +
				"(18, 'Điểm xuất phát - kết thúc tour', 'start_end')," +
				"(19, 'Chùa', 'temple')," +
				"(20, 'Sân bay', 'airport');"),
			queryInterface.sequelize.query("INSERT INTO `type_passenger` (`id`, `name`) VALUES" +
				"(1, 'adults')," +
				"(2, 'children');"),
			queryInterface.sequelize.query("INSERT INTO `transports` (`id`, `name_vn`, `name_en`) VALUES" +
				"(1, 'Đường bộ', 'roadway')," +
				"(2, 'Đường thủy', 'waterway')," +
				"(3, 'Đường hàng không', 'airway')," +
				"(4, 'Đường sắt', 'railway');"),
			queryInterface.sequelize.query("INSERT INTO `payment_method` (`id`, `name`) VALUES" +
				"(1, 'incash'), " +
				"(3, 'online'), " +
				"(2, 'transfer');"),
			queryInterface.sequelize.query("INSERT INTO `admins` (`id`, `username`, `name`, `password`) VALUES" +
				"(1, 'admin', 'ADMIN', '$2a$10$PqMsU1cjeWI4djNgKQXl6.6fkPWRqvPcNVpg47x1r1tooBEq.IJFK')," +
				"(2, 'nnlinh97', 'nnlinh', '$2a$10$JyHUnzm6z5/l1NdQR0IJjOrpMnGbm456hRqMa2a2CN26vrTLThrZe');"),
			queryInterface.sequelize.query("INSERT INTO `users` (`id`, `username`, `fullname`, `password`, `sex`, `address`, `birthdate`, `phone`, `email`, `avatar`, `isActive`, `type`) VALUES" +
				"(1, 'tblong', 'Thái Bá Long', '$2a$10$FBxM.3qOWiBOChTtQUNuju26KiU/aQicH5IGnqFwhchXcD4o.xbnK', 'male', NULL, NULL, '0123456789', NULL, NULL, 1, 'local')," +
				"(3, 'thaibalong', 'Thái Bá Long 2', '$2a$10$8SBPUyrj4QpJ8sHJbP1oAelXSTnNUDZX6YyvG3b0adczBWoeEDD9y', 'male', NULL, NULL, NULL, 'tblong@gmail.com', NULL, 1, 'local')," +
				"(4, 'nguoila', 'Người Lạ Ơi', '$2a$10$e4s.xPY2iZZ6nvD9wnZZcOHCC3kjycEQhkkZ79qieZ4PkvpAK/Zi.', 'male', NULL, NULL, '0702524116', 'la@gmail.com', NULL, 1, 'local')," +
				"(5, 'nguoila', 'Người Lạ Ơi 02', '$2a$10$k3u4SQeoH1k..vxPcbbIkuTtcopvtqoWJykbYQzah0yQ5InD452Sm', 'other', 'đéo có địa chỉ', '1997-11-24', '0802524116', 'la02@gmail.com', '5-1552032846893.jpg', 1, 'local')," +
				"(7, 'nnlinh97', 'Người Lạ', '$2a$10$o48sRtWBKq/t5xuBrXCcM.klfGp8d7LrEW7HEXnk.XBD1Ck5rQeuG', 'male', NULL, '1997-10-14', '0102524119', 'la0003@gmail.com', '7-anh avatar dep 2.jpg', 1, 'local')," +
				"(9, '', 'new usser', '$2a$10$wtLa/mR.hZ1Oq/lFaebywelUSTyo8MxtQ7jEU56nGyDKJbCztMBWG', 'other', NULL, '1997-11-24', '0102521548', 'newuser@gmail.com', '9-1552032615094.jpg', 1, 'local')," +
				"(10, '', 'Thái Bá Long', '$2a$10$R7Mqj0M77zkhYwZJY8U71.nMthj2iTjwexvro2PURyjqwFUfAYI.e', NULL, NULL, NULL, NULL, 'thaibalong7@gmail.com', 'https://graph.facebook.com/15465484654864521000/picture?width=100', 1, 'facebook')," +
				"(11, '', 'Thái Bá Long', '$2a$10$v530GHSlF3cw1BgKITihduKVKz/RtaHjkhEFmQCJMJ0IfCd04PdlC', NULL, NULL, NULL, NULL, 'thaibalong9@gmail.com', 'https://graph.facebook.com/154654846548641500000/picture?width=100', 1, 'facebook')," +
				"(12, '', 'Thái Bá Long', '$2a$10$1TF2dnwgD1m0CTLwQbKWg.r/Hk5QHW2mnEa52gGieQypfU6.tfQzG', NULL, NULL, NULL, '0396462182', 'thai.balong.7@gmail.com', NULL, 1, 'local')," +
				"(13, '', 'Dragon Ryuuu', '$2a$10$6U4zshkxpAktCCdAx5EDjerrP9okd.oGGpXYgpeHJejJ9YujsfpFe', NULL, NULL, NULL, '0396462187', 'dragon97qn@gmail.com', NULL, 1, 'local');"),
			queryInterface.sequelize.query("INSERT INTO `tours` (`id`, `name`, `description`, `detail`, `featured_img`, `policy`) VALUES" +
				"(1, 'Tour tham quan Sài Gòn (nửa ngày)', 'Tham quan những địa danh mang đậm dấu ấn lịch sử như Bảo tàng chứng tích chiến tranh, Dinh Độc Lập.\r\nTìm hiểu nét văn hóa và một số kiến trúc độc đáo - điều tạo nên một phần linh hồn mảnh đất Sài Gòn: Nhà thờ Đức Bà, Bưu điện thành phố.\r\n\r\nBạn được trải nghiệm những gì?\r\nHành trình bắt đầu với chuyến thăm Bảo tàng chứng tích chiến tranh - top 5 trong số 25 bảo tàng hấp dẫn nhất châu Á. Đến với bảo tàng, bạn sẽ giật mình nhận ra đằng sau một cuộc sống hòa bình, yên ổn - mà bạn tưởng chừng như hiển nhiên này - là cả một chặng đường lịch sử thấm đẫm máu và nước mắt của dân tộc. Bảo tàng chứng tích chiến tranh như một nốt lặng tĩnh tâm giữa chốn phồn hoa đô hội, giúp bạn thêm yêu, thêm trân trọng cuộc sống thanh bình này.\r\n\r\nĐiểm dừng chân tiếp theo của Tour tham quan Sài Gòn chính là Dinh Độc Lập - một di tích quốc gia đặc biệt, dấu son quyền lực của của quá khứ. Dinh Độc Lập còn cuốn " +
				"hút bạn bởi những câu chuyện lịch sử thú vị về sự hình thành, sự tồn tại, ý nghĩa văn hóa trong lối kiến trúc độc đáo và những dấu mốc lịch sử của đất nước mà nó đã mang trong mình hàng trăm năm qua. Chỉ vài giờ tham quan ngắn ngủi nhưng đủ giúp bạn hình dung về một giai đoạn lịch sử đầy biến động, và thêm tự hào về chiến thắng lịch sử vẻ vang của dân tộc Việt Nam.\r\n\r\nCuối hành trình, hãy trở về trung tâm thành phố để thăm Nhà thờ Đức Bà. Nơi giao hòa giữa nét cổ xưa và hiện đại, giữa kiến trúc phương Tây và văn hóa phương Đông. Bạn sẽ không khỏi trầm trồ thán phục trước màu gạch nơi đây vẫn giữ nguyên vẹn màu hồng tươi, chẳng bám chút bụi rêu, dẫu trải qua bao nắng mưa, thử thách. Nếu muốn tận hưởng hết vẻ đẹp của Nhà thờ Đức Bà, hãy dành chút thời gian ngồi lại, thưởng thức thú vui cà phê bệt trong ánh đèn lung linh phản chiếu từ các tòa cao ốc, cùng hòa nhịp sống với người Sài Gòn khi đêm về. " +
				"Lúc đó bạn sẽ nhận ra Nhà thờ Đức Bà tựa như một nốt nhạc bình yên giữa bản nhạc xô bồ, vội vã của đất Sài Gòn này.', 'Buổi sáng:  Xe và hướng dẫn viên Trung tâm lữ hành Quốc tế Trippy đón Quý khách tại điểm hẹn, khởi hành đi tham quan. Tham quan Bảo tàng chứng tích chiến tranh trên đường Võ Văn Tần. Di chuyển đến Dinh Độc Lập. Dạo chơi ở Nhà thờ Đức Bà. Tham quan Bưu điện Thành phố. Buổi trưa:  Đoàn về lại điểm đón ban đầu, kết thúc hành trình.', 'SG_featured_image.png', NULL)," +
				"(2, 'Tham Quan Sài Gòn - TP. HCM 1 Ngày', 'Sài Gòn - Tp.HCM là trung tâm du lịch lớn nhất nước, thu hút hàng năm 70% lượng khách quốc tế đến Việt Nam. Với nhịp sống sôi động, các công trình kiến trúc Pháp cổ: Nhà thờ Đức Bà, Dinh Thống Nhất, Ủy ban nhân dân thành phố, Bưu điện thành phố; khu phố người Hoa và vô số các khu vui chơi, giải trí đã tạo nên sức hấp dẫn của Sài gòn.\r\n\r\nNỔI BẬT:\r\n\r\nCụm kiến trúc thời Pháp + Mỹ: Dinh Thống Nhất, Nhà Thờ Đức Bà, Bưu Điện Thành Phố, Uỷ Ban Nhân Dân Thành Phố. Khu vực hoạt động của người Hoa ở Sài Gòn: Chợ Lớn, chợ Bình Tây.\r\nBảo tàng chiến tích chiến tranh.', '', 'SG_TPHCM_featured_image.png', NULL)," +
				"(3, 'Vũng Tàu - Đà Lạt', 'Tour Đà Lạt - Vũng tàu giá rẻ của công ty, với các địa điểm du lịch hàng đầu Việt Nam sẽ khiến bạn và gia đình có những giây phút đáng nhớ trong cuộc đời.', 'Ngày 1: Vũng Tàu - Đà Lạt - Khách sạn. (Ăn sáng, trưa chiều).\r\nNgày 2: Khách sạn - Nhà thờ Con Gà - Thiền viện Trúc Lâm - Dinh Bảo Đại - Showroom hoa nghệ thuật  - Khách sạn. (Ăn sáng, trưa).\r\nNgày 3: Khách sạn - Ga xe lửa cổ - Làng hoa Vạn Thành - Khách sạn (Đà lạt) - Vũng Tàu (Ăn sáng, trưa ,chiều).', 'VT_DL_featured_image.png', 'Nếu Quý khách hủy tour từ 5 ngày trở lên so với ngày khởi hành, chịu phí: 10%\r\nNếu Quý khách hủy sau 2 ngày đến trước ngày đi 24 tiếng: 50%.\r\nNếu Quý khách hủy trong vòng 24 giờ: chịu phí 100 %.')," +
				"(4, 'Thành phố Hồ Chí Minh 1 ngày', 'Hành trình du lịch Sài Gòn 1 ngày đưa du khách đến với thành phố mang tên Bác, từ lâu đã là trung tâm văn hóa, kinh tế của Việt Nam, thành phố này còn có có tên gọi khác là Hòn Ngọc Viễn Đông. Đến thành phố Hồ Chí Minh, thành phố có hơn 300 tuổi đời, bạn sẽ thấy những tòa nhà cao tầng, khu vui chơi giải trí, trung tâm mua sắm. Bên cạnh đó những phồn hoa chốn đô thị thì bạn cũng có thể thấy những biệt thự cổ kính, chợ truyền thống lâu đời…\r\n', 'Đại học Khoa Học Tự Nhiên - Nhà thờ Chánh Tòa Đức Bà Sài Gòn - Bưu điện TPHCM - Nhà hát TPHCM - Đại học Khoa học Tự Nhiên (Ăn trưa)', 'TPHCM_featured_image.png', 'Nếu Quý khách hủy tour: chịu phí 100 %.\r\n')," +
				"(5, 'TPHCM - Đà Lạt - Đà Nẵng', 'Tour TPHCM - Đà Lạt - Đà Nẵng sẽ dừng chân tại một thành phố du lịch nổi tiếng được mệnh danh là Thành phố ngàn thông, Thành phố hoa anh đào, Thành phố mù sương... Cho dù với tên gọi nào thì Đà Lạt vẫn luôn có sức quyến rũ đặc biệt đối với du khách bốn phương bởi khí hậu mát mẻ, không khí trong lành, khung cảnh nên thơ và những truyền thuyết tình yêu lãng mạn. Và  đến với dải đất miền Trung với nhiều nắng gió lại là nơi lưu giữ những giá trị văn hóa con người tạo dựng. Trên dải đất hẹp từ Quảng Bình tới Quảng Nam hình thành nên con đường du lịch di sản miền Trung đã trở thành điểm đến thu hút đông đảo du khách trong và ngoài nước. Hành trình khám phá bức tranh miền Trung xinh đẹp, của Đà Nẵng nổi tiếng với bờ biển dài, quyến rũ; của Hội An nơi phố cổ bình yên, cổ kính; " +
				"của đất Huế kinh thành lộng lẫy chốn hoàng cung… tất cả tạo ấn tượng cho du khách tham quan. ', 'Ngày 1: Bưu điện TPHCM - Thác Prenn - Thiền viện Trúc Lâm - Khách sạn (Ăn trưa, Ăn tối).\r\nNgày 2 : Khách sạn - Thũng lũng vàng - Dinh Bảo Đại - Làng Hoa Vạn Thành - Showroom hoa nghệ thuật  - Khách sạn. (Ăn sáng, trưa, tối).\r\nNgày 3: Khách sạn - Nhà thờ Con Gà - Ga xe lửa - Chùa Linh Phước - Langbiang - Khách sạn (Ăn sáng, trưa, tối).\r\nNgày 4: Khách sạn (Đà Lạt) - Khách sạn (Đà Nẵng) - Bảo tàng 3D TrickEye - Ký Ức Hội An Show - Khách sạn (Ăn sáng, trưa, tối).\r\nNgày 5: Khách sạn - Bà Nà Hills - Khách sạn (Ăn sáng, trưa, tối).\r\nNgày 6: Khách sạn(Đà Nẵng) -  Bưu điện TPHCM (Ăn sáng, trưa, tối).', 'TpHCM_DL_DN_featured_image.png', 'Nếu Quý khách hủy tour từ 7 ngày trở lên so với ngày khởi hành, chịu phí: 10%\r\nNếu Quý khách hủy sau 3 ngày đến trước ngày đi 2 ngày: 50%.\r\nNếu Quý khách hủy trong vòng 2 ngày: chịu phí 100 %.\r\n')," +
				"(6, 'Nam - Bắc', 'Thưởng ngoạn các danh lam thắng cảnh miền Trung, miền Bắc. Xin chân trọng giới thiệu tới Du khách chương trình \"những di sản văn hóa và di sản thiên nhiên thế giới\" bao gồm: Phố cổ Hội An, Quần thể di tích Huế, vịnh Hạ Long. Chuyến du lịch hành hương với danh thắng chùa Hương và đệ nhất Thiền Viện Việt Nam – Trúc Lâm Yên Tử. Chinh phục con đường Trường Sơn huyền thoại. Cùng nhiều loại hình du lịch vui tươi phong phú khác... Hứa hẹn các bạn sẽ có một chuyến du ', 'Ngày 1: Đoàn khởi hành rời TP.Hồ Chí Minh đi Nha Trang. Trên đường ghé Phan Thiết, du khách dừng chân nghỉ ngơi và ngắm biển Đồi Dương. Ghé tham quan bãi biển Cà Ná – nơi giao hoà tuyệt đẹp giữa núi và biển. Đoàn đi theo đường mới ven biển Sông Lô – Hòn Rớm ngắm cảnh biển tuyệt vời trên Vịnh Cam Ranh. Đoàn vào Nha Trang theo con đường mới ven biển Sông Lô – Hòn Rớ, qua đèo Cù Huân ngắmcảnh biển chiều trên vịnh Nha Trang. " +
				"Đến Nha Trang (tỉnh Khánh Hòa) đoàn thưởng thức tiệc Buffet tối đặc biệt, sau đó về khách sạn. Buổi tối, xe đưa Quý khách đi dạo phố biển về đêm, qua chợ đêm Nha Trang, công viên Phù Đổng, Cà phê Bốn Mùa, khu hải sản Tháp Bà…Nghỉ đêm tại Nha Trang. (Ăn sáng trưa, chiều, tối).\r\n\r\nNgày 2: Xe đưa đoàn khởi hành đi Dốc Lết, trên đường Quý khách  thưởng ngoạn các thắng cảnh nổi tiếng Nha Trang như: cầu Xóm Bóng, núi Cô Tiên, Hòn Chồng... Đến với bãi biển White Sand - Dốc Lết, một trong những bãi biển đẹp nổi tiếng của Khánh Hòa với bãi cát trắng thoai thoải trãi dài cùng làn nước trong xanh và hàng dừa nghiêng mình soi bóng,  Quý khách tắm biển và thưởng thức các món hải sản của ngư dân địa phương đánh bắt. Đoàn đi tham quan Trung tâm Ngọc Trai Long Beach Pearl Nha Trang, là một trong hai trung tâm Ngọc Trai lớn nhất khu vực miền trung do tập đoàn Long Beach Pearl đầu tư. " +
				"Đến đây Quý khách được nghe giới thiệu về qui trình nuôi cấy - khai thác - chế tác ngọc trai, được tham quan khu trưng bày với hơn 3.000 mẫu ngọc trai thiết kế tinh tế - đẹp mắt và sang trọng. Tối khuya Đoàn ra sân bay Cam Ranh làm thủ tục bay Đà Nẵng. (Ăn sáng, trưa, tối).\r\n\r\nNgày 3: Lên Bán Đảo Sơn Trà mục kích phố biển Đà Nẵng trên cao, viếng Linh Ứng Tự - nơi có tượng Phật Bà 67m cao nhất Việt Nam và tắm biển Mỹ Khê Đà Nẵng. Ăn tối nhà hàng. Trãi nghiệm cảm giác với Vòng quay Mặt trời SUN WHEEL – Top 10 vòng quay cao nhất Thế Giới, chiêm ngưởng vẻ đẹp Đà Thành về đêm rực rỡ ánh đèn. (Vé Sun Wheel tự túc). Nghỉ đêm tại Bán Đảo Sơn Trà. (Ăn sáng, trưa, tối).\r\n\r\nNgày 4: Tham quan Bảo Tàng Đà Nẵng - Nơi trưng bày các kỷ vật phản ảnh đời sống văn hóa, lịch sử và con người Xứ Quảng. Chụp hình lưu niệm Trung tâm hành chính – Biểu tượng vươn lên mạnh mẽ của thành phố Đà Nẵng.Tiếp tục tham quan Ngũ Hành Sơn - Khám phá các hang động, vãn cảnh đẹp non nước trời mây. " +
				"Khởi hành vào Hội An bách bộ tham quan và mua sắm Phố Cổ với: Chùa Cầu Nhật Bản, Nhà Cổ hàng trăm năm tuổi, Hội Quán Phước Kiến & Xưởng thủ công mỹ nghệ.  Ăn tối Đặc sản Hội An: Cao lầu, bánh bao bánh vạc, hoành thánh, .. Nghỉ đêm tại Phố Cổ. (Ăn sáng, trưa, tối).\r\n\r\nNgày 5: Khởi hành lên Bà Nà 9h00 sáng: Đến ga cáp treo Suối Mơ, lên tuyến cáp treo đạt 4 kỷ lục thế giới. 9h30 sáng: Tham quan Cầu vàng - Cây cầu độc đáo nằm trong vườn Thiên Thai ở Bà Nà Hill. Tham quan Khu Le Jardin, tham quan Hầm Rượu Debay của Pháp. Viếng Chùa Linh Ứng Bà Nà, chiêm ngưỡng tượng Phật Thích Ca cao 27m, Vườn Lộc Uyển, Quan Âm Các. Tiếp tục đến Gare Debay đi tuyến cáp thứ 2 lên đỉnh Bà Nà. Hướng dẫn đưa đoàn vào tham quan khu vui chơi Fantasy Park tham gia các trò chơi phiêu lưu mới lạ, ngộ nghĩnh, hấp dẫn, hiện đại như vòng quay tình yêu, Phi công Skiver, Đường đua lửa, Xe điện đụng Ngôi nhà ma. " +
				"Khởi hành đi Cố Đô Huế - Di sản văn hoá Thế Giới, xuyên hầm đường bộ đèo Hải Vân, dừng chân tại làng chài Lăng Cô chụp hình lưu niệm.Tham quan Lăng Khải Định - công trình mang nhiều trường phái kiến trúc khác nhau, kết hợp Đông - Tây, Âu - Á, Cổ Kim độc đáo so với các công trình kiến trúc truyền thống Việt Nam. Nhận phòng khách sạn nghỉ ngơi. (Ăn sáng, trưa, tối).\r\n\r\nNgày 6: Khởi hành đi Cố Đô Huế - Di sản văn hoá Thế Giới, xuyên hầm đường bộ đèo Hải Vân, dừng chân tại làng chài Lăng Cô chụp hình lưu niệm.Tham quan Lăng Khải Định - công trình mang nhiều trường phái kiến trúc khác nhau, kết hợp Đông - Tây, Âu - Á, Cổ Kim độc đáo so với các công trình kiến trúc truyền thống Việt Nam. Nhận phòng khách sạn nghỉ ngơi. Ngồi thuyền ngược sông Son chinh phục Động Phong Nha: Cô Tiên & Cung Đình dưới sâu lòng núi nơi có con sông ngầm từ Lào chảy sang, chiêm ngưỡng các khối thạch nhũ tuyệt đẹp được kiến tạo bởi thiên nhiên qua hàng ngàn thiên niên kỷ. " +
				"Khởi hành về Huế để chiêm ngưỡng vẻ đẹp của Kinh Thành Huế. Xe đến đón quý khách ra sân bay khởi hành đi Hà Nội. (Ăn sáng, chiều, tối).\r\n\r\nNgày 7: Xe khởi hành đi Ninh Bình, ngắm cảnh vùng nông thôn Việt Nam. Đến Ninh Bình, Quý khách ghé thăm Cố đô Hoa Lư - Kinh đô của nước ta vào thế kỷ X - nơi có hai ngôi đền thờ vua Đinh và vua Lê.  Đoàn khởi hành đi Hạ long – Di sản thế giới được UNESCO công nhận năm 1994, thăm quan động Thiên Cung và hang Dấu Gỗ, đi qua Hòn Lư Hương, Hòn Gà Chọi, Hòn Chó Đá, (Dùng cơm trưa trên tàu trước khi thăm quan hang động). Tự do hoặc vui chơi tại công viên Hoàng Gia – Nghỉ đêm tại khách sạn Hạ Long. (Ăn sáng, trưa, tối).\r\n\r\nNgày 8: Hướng dẫn viên đón đoàn khởi hành đi Yên Tử. Đến Yên Tử, Quý khách leo núi khám phá vẻ đẹp tự nhiên của núi Yên Tử – còn được gọi là Bạch Vân Sơn (núi giữa mây trắng) cao hơn 1000m. Nghỉ ngơi, ăn trưa, lễ chùa tại khu vực chùa Hoa Yên. " +
				"Quý khách tiếp tục leo núi, chinh phục chặng đường khó khăn nhất của núi rừng Yên Tử mà đỉnh cao nhất là chùa Đồng (nằm ở độ cao 1068m so với mặt nước biển), lễ Phật và thưởng ngoạn cảnh đại ngàn Yên Tử từ trên đỉnh núi. Quý khách leo núi trở xuống chùa Hoa Yên. Đi cáp treo (vé tự túc) ngắm nhìn cảnh đẹp của Yên Tử từ trên cao với những chặng đường đã đi qua. Xe đón quý khách lên tàu đi Lào Cai.  (Ăn sáng, chiều , tối).\r\n\r\nNgày 9 : Tàu tới ga Lào Cai, xe ôtô đón quý khách lên Bản Cát Cát (Sapa),tìm hiểu về lối sống và phong tục của người H’Mông (đi bằng xe ôtô riêng) thăm nhà máy thuỷ điện từ thời Pháp thuộc, thăm trường học và nhà ở của đồng bào dân tộc thiểu số, kỹ thuật nhuộm chàm của người H’Mông, tự do dạo chơi. Quý khách nghỉ đêm tại Bản Cát Cát. (Ắn sáng, trưa, chiều).. (Ăn sáng, chiều , tối).\r\n\r\nNgày 10: Quý khách đi thăm Hàm Rồng (đi bộ) để ngắm cảnh thị trấn Sapa và khám phá hàng trăm loại phong lan, cây cảnh mà chỉ ở nơi đây mới có. " +
				"Quý khách tự do dạo chơi, đi chợ Sapa tham quan và mua quà lưu niệm. Lên tàu đêm về Hà Nội. Đoàn đi viếng Lăng Bác: phủ Chủ Tịch, vườn cây ao cá, nhà sàn Bác Hồ, chùa Một Cột. Xe đưa du khách ra sân bay chia tay. Kết thúc Tour Du Lich Xuyên Việt Miền Nam - Miền Bắc 10 Ngày và hẹn tái ngộ.  (Ăn sáng, chiều , tối).', 'N_B_featured_image.png', 'Báo giá không bao gồm\r\n- Ăn uống ngòai chương trình, và các chi phí tắm biển, vui chơi giải trí cá nhân.\r\nGiá vé dành cho trẻ em\r\n-Trẻ em dưới 02 tuổi: 25% giá tour (ngủ chung với người lớn).\r\n-Trẻ em từ trên 2 tuổi đến dưới 12 tuổi: 75% giá tour (ngủ chung với người lớn), 85% giá tour (bé ngủ giường riêng).\r\n-Trẻ em từ 12 tuổi trở lên: 100% giá tour như người lớn.\r\nĐiều kiện hủy tour\r\nSau khi đăng ký tour, nếu quý khách thông báo hủy tour:\r\n- Trước ngày khởi hành 30 ngày: phí hoàn vé là 10% giá tour.\r\n- Từ sau 30 ngày đến trước 15 ngày: phí hoàn vé là 40% giá tour.\r\n- " +
				"Từ sau 15 ngày đến trước 05 ngày: phí hoàn vé là 60% giá tour.\r\n- Từ 05 ngày trước ngày khởi hành: phí hoàn vé là 100% giá tour.');"),
		]);
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/

		return Promise.all([
			queryInterface.bulkDelete('types', null, {}),
			queryInterface.bulkDelete('type_passenger', null, {}),
			queryInterface.bulkDelete('transports', null, {}),
			queryInterface.bulkDelete('payment_method', null, {}),
			queryInterface.bulkDelete('admins', null, {}),
			queryInterface.bulkDelete('users', null, {}),
			queryInterface.bulkDelete('tours', null, {}),
		]);
	}
};
