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
			queryInterface.bulkInsert('countries', [
				{
					id: 2,
					name: 'Thổ Nhĩ Kỳ'
				}
			]).then(() => {
				return Promise.all([
					queryInterface.bulkInsert('provinces', [
						{
							id: 97,
							name: 'Istanbul',
							fk_country: 2,
						},
						{
							id: 98,
							name: 'Çanakkale',
							fk_country: 2,
						},
						{
							id: 99,
							name: 'İzmir',
							fk_country: 2,
						},
						{
							id: 100,
							name: 'Denizli',
							fk_country: 2,
						},
						{
							id: 101,
							name: 'Nevşehir',
							fk_country: 2,
						},
						{
							id: 102,
							name: 'Aydın',
							fk_country: 2,
						},
						{
							id: 103,
							name: 'Konya',
							fk_country: 2,
						},
						{
							id: 104,
							name: 'Aksaray',
							fk_country: 2,
						}
					])
				])
			}),
			queryInterface.bulkInsert('locations', [
				{
					id: 91,
					latitude: 10.815611,
					longitude: 106.663974,
					name: 'Sân bay Tân Sơn Nhất',
					address: 'Phường 2, Tân Bình, Hồ Chí Minh, Việt Nam',
					description: 'Sân bay quốc tế Tân Sơn Nhất là cảng hàng không quốc tế ở miền Nam Việt Nam. Sân bay quốc tế Tân Sơn Nhất với diện tích 850 ha đứng thứ hai về mặt diện tích và đứng thứ nhất về mặt công suất nhà ga và cũng là sân bay có lượng khách lớn nhất Việt Nam.',
					featured_img: '61.png',
					status: 'active',
					fk_type: 20
				},
				{
					id: 92,
					latitude: 40.976111,
					longitude: 28.814167,
					name: 'Sân bay Atatürk Istanbul',
					address: 'Yeşilköy, 34149 Bakırköy/Istanbul, Thổ Nhĩ Kỳ',
					description: 'Là một sân bay quốc tế tại Istanbul. Sân bay được đặt tên theo Mustafa Kemal Atatürk, người sáng lập và là tổng thống đầu tiên của Cộng hòa Thổ Nhĩ Kỳ. Với số lượng khách thông qua đạt 37,4 triệu lượt nămr 2011, đây là một trong những 40 sân bay hàng đầu thế giới về số lượt khách và nằm trong nhóm 35 sân bay hàng đầu về lưu lượng khách quốc tế. Đây là sân bay tấp nập thứ 8 châu Âu và thứ 16 thế giới về số lượng khách quốc tế. ',
					featured_img: '62.png',
					status: 'active',
					fk_type: 20
				},
				{
					id: 93,
					latitude: 39.957500,
					longitude: 26.238889,
					name: 'Thành cổ Troy',
					address: '17100 Kalafat Köyü/Çanakkale Merkez/Çanakkale, Thổ Nhĩ Kỳ',
					description: 'Troia hay Troy (tiếng Hy Lạp: Τροία Troia hay Ίλιον Ilion; tiếng Latin: Troia, Ilium), còn được nhắc đến là Tơ-roa hay Tơroatrong một số tài liệu[1], là phế tích của một thành luỹ cổ nằm bên bờ biển phía tây Thổ Nhĩ Kỳ. Vào những năm 1200 trước Công nguyên, nơi đây là tâm điểm của Cuộc chiến Thành Troia nổ ra giữa hai thành phố Mycenae và Troy để giải quyết những tranh chấp về thông thương và tiền bạc. Thành Troia đã được UNESCO công nhận là di sản thế giới vào năm 1998',
					featured_img: '63.png',
					status: 'active',
					fk_type: 15
				},
				{
					id: 94,
					latitude: 40.145458,
					longitude: 26.413519,
					name: 'Parion Hotel',
					address: 'İsmet Paşa Mh. Demircioğlu Cd. No : 130, 17000, Thổ Nhĩ Kỳ',
					description: 'Cung cấp một hồ bơi trong nhà và một trung tâm chăm sóc sức khỏe và spa bao gồm cả phòng tắm kiểu Thổ Nhĩ Kỳ, Parion Hotel nằm ở trung tâm anakkale. Wi-Fi miễn phí có thể truy cập trong toàn hotel.',
					featured_img: '64.png',
					status: 'active',
					fk_type: 14
				},
				{
					id: 95,
					latitude: 37.948509,
					longitude: 27.368055,
					name: 'Thành phố cổ đại Ephesus',
					address: 'Atatürk Mh., Uğur Mumcu Sevgi Yolu, 35920 Selçuk/İzmir, Thổ Nhĩ Kỳ',
					description: 'Một trong những điểm du lịch hấp dẫn nhất ở Thổ Nhĩ Kỳ là thành phố cổ Ephesus. Thành phố này từng là trung tâm của Địa Trung Hải do người La Mã cổ đại xây dựng nên cách đây khoảng 3000 năm. Với rất nhiều cấu trúc kiến ​​trúc hiện nay được khám phá, Ephesus là điểm đến không thể bỏ qua đối với những người yêu thích văn hóa và đam mê khảo cổ học mỗi khi đi du lịch Thổ Nhĩ Kỳ.',
					featured_img: '65.png',
					status: 'active',
					fk_type: 15
				},
				{
					id: 96,
					latitude: 37.857437,
					longitude: 27.257145,
					name: 'Villa Konak Hotel',
					address: 'Camiatik Mahallesi, Yıldırım Cd. No:55, 09400 Kuşadası/Aydın, Thổ Nhĩ Kỳ',
					description: 'Khách sạn có bầu không khí truyền thống, yên tĩnh trong khu dân cư lịch sử của Kuşadası, cách trung tâm thị trấn sôi động 5 phút đi bộ.',
					featured_img: '66.png',
					status: 'active',
					fk_type: 14
				},
				{
					id: 97,
					latitude: 37.926712,
					longitude: 29.127382,
					name: 'Phố cổ Hierapolis',
					address: '20280 Pamukkale/Denizli, Thổ Nhĩ Kỳ',
					description: 'Hierapolis là thành phố Hy Lạp-La Mã và Byzantine cổ đại trên các suối nước nóng nằm ở tây nam Thổ Nhĩ Kỳ gần Denizli, được UNESCO công nhận là di sản của thế giới.',
					featured_img: '67.png',
					status: 'active',
					fk_type: 17
				},
				{
					id: 98,
					latitude: 37.913892,
					longitude: 29.118716,
					name: 'Pamukka',
					address: '20190 Pamukkale/Denizli Thổ Nhĩ Kỳ',
					description: 'Kỳ quan thiên nhiên thứ 8 của thế giới sẽ khiến bạn ngỡ ngàng và thích thú như đang lơ lửng giữa các tầng mây. Thổ Nhĩ Kỳ đâu chỉ có Instanbul, Pamukkale mới thực sự là thiên đường. Pamukkale có nghĩa là "Lâu đài bông" là một cảnh quan thiên nhiên nằm trong Thung lũng sông Menderes thuộc tỉnh Denizli, Thổ Nhĩ Kỳ',
					featured_img: '68.png',
					status: 'active',
					fk_type: 17
				},
				{
					id: 99,
					latitude: 37.919432,
					longitude: 29.109359,
					name: 'Tripolis Hotel',
					address: 'Kale Mahallesi, Adnan Kahveci Blv. No:96, 20190 Pamukkale/Denizli, Thổ Nhĩ Kỳ',
					description: 'Khi đến thăm Pamukkale, bạn sẽ cảm thấy như đang ở nhà tại Tripolis Hotel, nơi có chất lượng tuyệt vời và dịch vụ chu đáo',
					featured_img: '69.png',
					status: 'active',
					fk_type: 14
				},
				{
					id: 100,
					latitude: 37.870762,
					longitude: 32.50501,
					name: 'Bảo tàng Philosopher Mevlana Celaleddin-I Rumi',
					address: 'Aziziye Mah, Mevlana Cd. No:1, 42030 Karatay/Konya, Thổ Nhĩ Kỳ',
					description: 'Khối kiến trúc mái vòm, tháp nhọn hình nón nổi bật một màu ngọc lam giữa trung tâm thành phố là biểu tượng của Konya, cố đô của Thổ Nhĩ Kỳ vào thế kỷ 12, 13. Bảo tàng Mevlana còn gọi là Tu viện Mevlana, Lăng Tẩm Xanh, hay Mái Vòm Xanh. Nơi này là điện thờ tu sĩ, nhà thần học, nhà thơ, nhà hiền triết vĩ đại nhất nước Thổ, Mevlana Celaleddin Rumi.',
					featured_img: '70.png',
					status: 'active',
					fk_type: 15
				},
				{
					id: 101,
					latitude: 38.248453,
					longitude: 33.547041,
					name: 'Caravanserai ',
					address: 'İstikamet Mahallesi, Atatürk Cd., 68000 Sultanhanı Belediyesi/Aksaray Merkez/Aksaray, Thổ Nhĩ Kỳ',
					description: 'Bạn hẳn từng nghe về Silk Road, con đường tơ lụa – con đường thiên lý vạn dặm là biểu tượng của sự thông thương hàng hoá Á – Âu suốt một giai đoạn dài trong lịch sử thế giới. Và đến với Thổ Nhĩ Kỳ là bạn sẽ với điểm cuối con đường tơ lụa huyền thoại ấy, nơi hàng hoá được tập trung trước khi toả vào Châu Âu, và dấu ấn còn sót lại chính là các Caravanserai – khách sạn hay lữ quán của thời cổ đại.',
					featured_img: '71.png',
					status: 'active',
					fk_type: 17
				},
				{
					id: 102,
					latitude: 38.545318,
					longitude: 34.870577,
					name: 'Gamirasu Hotel Cappadocia',
					address: 'Ayvalı Köyü İç Yolu, 50400 Ayvalı Köyü/Ürgüp/Nevşehir, Thổ Nhĩ Kỳ',
					description: 'Nhà hàng của Gamirasu Hotel Cappadocia phục vụ các món ăn truyền thống của vùng Cappadocia, được chế biến từ những sản vật hữu cơ.',
					featured_img: '72.png',
					status: 'active',
					fk_type: 14
				},
				{
					id: 103,
					latitude: 38.640053,
					longitude: 34.845368,
					name: 'Goreme Open Air Museum',
					address: 'Merkez, Müze Cd., 50180 Göreme Belediyesi/Nevşehir Merkez/Nevşehir, Thổ Nhĩ Kỳ',
					description: 'Một trung tâm quan trọng của đạo Cơ Đốc Giáo, với nhiều tu viện, nhà thờ và nhà nguyện được xây dựng trong những năm đầu của thời kỳ Trung Cổ từ thế kỷ 11 - 13, với cấu trúc khoét sâu vào các hẻm đá, vách đá',
					featured_img: '73.png',
					status: 'active',
					fk_type: 15
				},
				{
					id: 104,
					latitude: 38.460132,
					longitude: 34.752141,
					name: 'Thành phố ngầm Kaymakli ',
					address: 'Cami Kebir Mahallesi, yeraltı şehri, Belediye Cd., 50760 Kaymaklı Belediyesi/Nevşehir Merkez/Nevşehir, Thổ Nhĩ Kỳ',
					description: 'Một trong những hệ thống thành trì ngầm lớn nhất với đầy đủ nhà cửa, nhà thờ, nơi cất trữ lương thực nằm ẩn sâu trong hang đá. Cao nguyên Cappadocia thuộc tỉnh Nevsehir của vùng đất huyền thoại Thổ Nhĩ Kỳ, nơi này có thể ví von như “vịnh Hạ Long trên cạn” bởi có hàng ngàn khối đá muôn hình vạn trạng. Ẩn mình dưới những khối đá đó là một hệ thống thành phố ngầm độc đáo. Sau đây là hai thành phố ngầm không thể bỏ qua ở cao nguyên Cappadocia.',
					featured_img: '74.png',
					status: 'active',
					fk_type: 17
				},
				{
					id: 105,
					latitude: 41.00325,
					longitude: 28.97706,
					name: 'TURKISH DANCE NIGHT SHOW',
					address: 'Istanbul, Sultan Ahmet Mahallesi, 34122 Fatih/Istanbul, Thổ Nhĩ Kỳ',
					description: 'Biểu diễn ca múa nhạc truyền thống địa phương được công nhận là di sản văn hóa phi vật thể. Chương trình Đêm Thổ Nhĩ Kỳ làm nổi bật các truyền thống khiêu vũ của các khu vực khác nhau của Thổ Nhĩ Kỳ',
					featured_img: '75.png',
					status: 'active',
					fk_type: 2
				},
				{
					id: 106,
					latitude: 38.772428,
					longitude: 35.493205,
					name: 'Sân bay Erkilet',
					address: 'Ahmet Yasevi Mahallesi, Mustafa Kemal Paşa Blv., 38090 Merkez/Kocasinan/Kayseri, Thổ Nhĩ Kỳ',
					description: 'Sân bay Erkilet hay Sân bay Kayseri Erkilet (tiếng Thổ Nhĩ Kỳ: Kayseri Erkilet Havaalani) (IATA: ASR, ICAO: LTAU) là một sân bay hỗn hợp quân sự/dân dụng cách 5 km về phía bắc[2] của Kayseri trong tỉnh Kayseri của Thổ Nhĩ Kỳ.' +
						'Sân bay này có thể phục vụ các máy bay như Boeing 747. Nhà ga có công suất thiết kế 1 triệu lượt khách mỗi năm.',
					featured_img: '76.png',
					status: 'active',
					fk_type: 20
				},
				{
					id: 107,
					latitude: 41.045606,
					longitude: 29.034213,
					name: 'Cầu Bosphorus',
					address: '22WM+6M Üsküdar, Kuzguncuk Mahallesi, Üsküdar/Istanbul, Thổ Nhĩ Kỳ',
					description: 'Sau khi được trang bị đèn led nhiều màu, hoa văn độc đáo chiếu sáng buổi tối, cầu Bosphorus trở thành một điểm tham quan đẹp mắt ở Istanbul. Cầu Bosphorus nối Ortaköy bên bờ Châu Âu với Beylerbeyi bên bờ Châu Á, thuộc địa phận thành phố Istanbul. Cầu có tổng chiều dài 1.510m, rộng 39m, khoảng cách giữa những nhịp chính là 1.074m, chiều cao thông thuyền là 64m. Khi hoàn thành vào năm 1973, cầu Bosphorus là cầu treo dài thứ tư thế giới. Hiện đây là cầu treo dài thứ 22 thế giới.',
					featured_img: '77.png',
					status: 'active',
					fk_type: 17
				},
				{
					id: 108,
					latitude: 41.010717,
					longitude: 28.968068,
					name: 'Chợ lồng Grand Bazaar',
					address: 'Beyazıt Mh., Kalpakçılar Cd. No:22, 34126 Fatih/İstanbul, Thổ Nhĩ Kỳ',
					description: 'Nằm giữa lõi phố cổ Istanbul (Thổ Nhĩ Kỹ), Grand Bazaar - khu chợ lớn với hơn 4.000 gian hàng nổi tiếng toàn thế giới không chỉ về quy mô mà còn vì rất độc đáo, với lịch sử hơn 500 năm. Đặc biệt, tuyệt đại đa số các gian hàng nơi đây đều do đàn ông làm chủ và trực tiếp bán hàng.',
					featured_img: '78.png',
					status: 'active',
					fk_type: 3
				},
				{
					id: 109,
					latitude: 40.91569,
					longitude: 29.143919,
					name: 'Elite Hotel Dragos',
					address: 'Yalı Mahallesi, Piri Reis Cd. No:3, 34844 Maltepe/İstanbul, Thổ Nhĩ Kỳ',
					description: 'Nằm cách đại lộ ven biển Turgut Özal chỉ 1 km, Elite Hotel Dragos cung cấp Wi-Fi miễn phí, các tiện ích spa và hồ bơi ngoài trời. Các phòng được trang bị máy lạnh và tất cả đều có truyền hình vệ tinh màn hình phẳng.' +
						'Phòng tại Dragos Elite Hotel đều có sàn trải thảm, minibar và bàn làm việc. Một số phòng nhìn ra Biển Marmara. Dịch vụ phòng cũng có tại đây.',
					featured_img: '79.png',
					status: 'active',
					fk_type: 14
				},
			]),
			queryInterface.bulkInsert('tours', [
				{
					id: 7,
					name: 'TPHCM - Thổ Nhĩ Kỳ',
					description: 'Thổ Nhĩ Kỳ: Nơi Á - Âu hội tụ ' +
						'Cơ hội thưởng ngoạn “xứ sở thảm bay”, vùng đất của những kỳ quan cổ xưa, của nền văn minh rực rỡ nhất thời cổ đại: đầy ắp các câu chuyện huyền thoại, kiệt tác kiến trúc của nhân loại.' +
						'- Chiêm ngưỡng The Blue Mosque - Giáo đường Xanh lộng lẫy, những điểm du lịch kỳ thú như di tích thành cổ Troy, quảng trường Hippodrome của những võ sĩ giác đấu thời Trung cổ hay viếng Cung điện Topkapi lớn nhất đế quốc Ottaman nay là bảo tàng lưu giữ nhiều cổ vật quý.' +
						'- Trải nghiệm du thuyền Bosphorus thưởng ngoạn cảnh quan hai bên bờ eo biển và cảng biển nổi tiếng Golden Horn, ngắm cung điện Dolmabahce và cây cầu Bosphorus nổi tiếng nối liền hai lục địa Á - Âu.' +
						'- Khám phá chợ lồng Bazaar với những âm thanh thủ thỉ thuyết phục của những anh chàng bán hàng người Thổ “điển trai”giữa bức phông màn sắc màu rực rỡ của hàng hóa.',
					detail: 'Ngày 1: TP.HCM - ISTANBUL. Quý khách tập trung tại sân bay Tân Sơn Nhất làm thủ tục đón chuyến bay tới Istanbul – Thành phố của Thổ Nhĩ Kỳ. Quý khách ăn nhẹ và nghỉ đêm trên máy bay. ' +
						'Ngày 2: ISTANBUL - CANAKKALE - TROY.  Di chuyển đến vùng đất Canakkale. Tham quan Thành cổ Troy. Nghỉ đêm tại Canakkale. (Ăn sáng, trưa, chiều).' +
						'Ngày 3: CANAKKALE - EPHESUS - KUSADASI. Trả phòng. Khởi hành đến thành phố biển Kusadasi. Trên đường đi dừng chân khám phá thành phố cổ đại Ephesus. Nghỉ đêm tại Kusadasi. (Ăn sáng, trưa, chiều).' +
						'Ngày 4: KUSADASI -  PAMUKKALE. Trả phòng. Di chuyển đến Pamukkale. Chiêm ngưỡng những tàn tích còn sót lại của thành phố cổ linh thiêng Hierapolis. Tiếp tục khám phá di sản thiên nhiên thế giới “Lâu Đài Bông”. Nghỉ đêm tại Pamukkale. (Ăn sáng, trưa, tối).' +
						'Ngày 5: PAMUKKALE - KONYA - CAPPADOCIA. Trả phòng. Di chuyển đến vùng đất linh thiêng Konya. Tham quan Bảo tàng Philosopher Mevlana Celaleddin-I Rumi. Tiếp tục hành trình đến Cappadocia. Trên đường đi, ghé thăm Caravanserai. Chiêm ngưỡng chương trình biểu diễn Ánh Sáng 3D trên đá Zelve Mapping (tùy theo điều kiện thời tiết). Nghỉ đêm tại Cappadocia. (Ăn sáng, trưa, tối).' +
						'Ngày 6: CAPPADOCIA. Khám phá Cappadocia: tham quan Bảo tàng ngoài trời Goreme Open Air Museum. Tiếp tục di chuyển đến Làng cổ Avanos. Thành phố ngầm Kaymakli hoặc Ozkonak. Thưởng thức chương trình biểu diễn ca múa nhạc truyền thống địa phương Turkish Night Dance. Nghỉ đêm tại Cappadocia. (Ăn sáng, trưa, tối).' +
						'Ngày 7: CAPPADOCIA - ISTANBUL. Quý khách có thể ngắm cảnh bình minh ở Cappadocia trên khinh khí cầu và tận hưởng một quang cảnh vô cùng độc đáo, ấn tượng (chi phí tự túc + nếu điều kiện thời tiết cho phép). Trả phòng. Di chuyển ra sân bay đáp chuyến bay nội địa về Istanbul. Trải nghiệm du ngoạn bằng tàu dọc eo biển Bosphorus, ngắm cây cầu Bosphorus nổi tiếng xuyên biển và nối liền 2 lục địa Á - Âu. Chiêm ngưỡng các kiến trúc đặc trưng và các hoạt động thường ngày của người dân địa phương dọc theo con sông, Nghỉ đêm ở Istanbul. (Ăn sáng, trưa, tối).' +
						'Ngày 8: ISTANBUL - TP.HCM. Trả phòng. Tiếp tục hành trình khám phá Istanbul: tham quan Vương Cung Thánh Đường Hagia Sophia, Quảng trường Hippodrome. Tham quan Cung điện Topkapi lớn nhất của đế quốc Ottoman. Tự do mua sắm tại Chợ lồng Grand Bazaar. Ra sân bay Istanbul, đáp chuyến bay về lại Tp. HCM. Nghỉ đêm trên máy bay. (Ăn sáng, trưa, tối, ăn nhẹ trên máy bay).' +
						'Ngày 9:  ISTANBUL - TP.HCM. Đoàn đến sân bay Tân Sơn Nhất lúc 13:10. Kết thúc chương trình tour du lịch Thổ Nhĩ Kỳ. (Ăn sáng, trưa).',
					featured_img: 'VN_TNK_featured_image.png',
					policy: 'GIÁ TOUR ĐÃ BAO GỒM:' +
						'- Visa nhập cảnh Thổ Nhĩ Kỳ. ' +
						'- Vé máy bay khứ hồi Thổ Nhĩ Kỳ và chuyến bay nội địa. ' +
						'- Thuế và các khoản phụ thu của hàng không.' +
						'- Khách sạn 5* tiêu chuẩn quốc tế (phòng đôi).' +
						'- Nước uống trên xe 0.5l/ khách/ngày' +
						'- Các bữa ăn được liệt kê theo chương trình.' +
						'- Vé tham quan theo chương trình.' +
						'- Hướng dẫn viên của công ty đi theo suốt tuyến.' +
						'- Xe máy lạnh sử dụng theo chương trình.' +
						'- Bảo hiểm du lịch toàn cầu với mức phí bồi thường tối đa 1.400.000.000 VND' +
						'GIÁ TOUR KHÔNG BAO GỒM:' +
						'- Phí phòng đơn (dành cho khách yêu cầu ở phòng đơn): ' +
						'- Nước uống (bia rượu trong bữa ăn), điện thoại, giặt ủi, hành lý quá cước theo quy định của hàng không.' +
						'- Chi phí cá nhân của khách ngoài chương trình.' +
						'- Chi phí nâng hạng vé máy bay. ' +
						'- Tiền bồi dưỡng cho hướng dẫn viên và tài xế địa phương (120.000VNĐ/ngày/khách x 8 ngày)' +
						'GIÁ TOUR DÀNH CHO TRẺ EM:' +
						'- Trẻ em dưới 2 tuổi: 30% giá tour người lớn.' +
						'- Trẻ em từ 2 tuổi đến dưới 12 tuổi: 85% giá tour người lớn (không có chế độ giường riêng).' +
						'- Trẻ em từ 2 tuổi đến dưới 12 tuổi: 100% giá tour người lớn (có chế độ giường riêng).' +
						'- Trẻ em đủ 12 tuổi trở lên: 100% giá tour người lớn.' +
						'QUY TRÌNH ĐĂNG KÝ & THANH TOÁN:' +
						'- Đợt 1: Đặt cọc 20.000.000 VND/khách. ' +
						'- Đợt 2: Thanh toán số tiền tour còn lại sau khi được chấp thuận visa.' +
						'ĐIỀU KHOẢN HỦY TOUR:' +
						'- Sau khi đặt cọc tour và trước khi nộp phí visa: 1.400.000VND (phí đặt cọc vé máy bay).' +
						'- Trường hợp Quý khách bị từ chối visa, lệ phí không hoàn lại là 3.000.000 VND.'
				},
			]).then(() => {
				return Promise.all([
					queryInterface.bulkInsert('tour_images', [
						{
							id: 58,
							name: 'VN_TNK_1.png',
							fk_tour: 7
						},
						{
							id: 59,
							name: 'VN_TNK_2.png',
							fk_tour: 7
						},
						{
							id: 60,
							name: 'VN_TNK_3.png',
							fk_tour: 7
						},
						{
							id: 61,
							name: 'VN_TNK_4.png',
							fk_tour: 7
						},
						{
							id: 62,
							name: 'VN_TNK_5.png',
							fk_tour: 7
						},
						{
							id: 63,
							name: 'VN_TNK_6.png',
							fk_tour: 7
						},
						{
							id: 64,
							name: 'VN_TNK_7.png',
							fk_tour: 7
						},
						{
							id: 65,
							name: 'VN_TNK_8.png',
							fk_tour: 7
						},
						{
							id: 66,
							name: 'VN_TNK_9.png',
							fk_tour: 7
						},
						{
							id: 67,
							name: 'VN_TNK_10.png',
							fk_tour: 7
						},
						{
							id: 68,
							name: 'VN_TNK_11.png',
							fk_tour: 7
						},
						{
							id: 69,
							name: 'VN_TNK_12.png',
							fk_tour: 7
						},
						{
							id: 70,
							name: 'VN_TNK_13.png',
							fk_tour: 7
						},
						{
							id: 71,
							name: 'VN_TNK_14.png',
							fk_tour: 7
						},
						{
							id: 72,
							name: 'VN_TNK_15.png',
							fk_tour: 7
						},
						{
							id: 73,
							name: 'VN_TNK_16.png',
							fk_tour: 7
						},
						{
							id: 74,
							name: 'VN_TNK_17.png',
							fk_tour: 7
						},
						{
							id: 75,
							name: 'VN_TNK_18.png',
							fk_tour: 7
						},
					]),
					queryInterface.bulkInsert('routes', [
						{
							id: 97,
							arrive_time: '20:00:00',
							leave_time: '21:30:00',
							day: 1,
							fk_location: 91,
							fk_tour: 7,
							fk_transport: 3
						},
						{
							id: 98,
							arrive_time: '07:00:00',
							leave_time: '08:00:00',
							day: 2,
							fk_location: 92,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 99,
							arrive_time: '10:30:00',
							leave_time: '15:30:00',
							day: 2,
							fk_location: 93,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 100,
							arrive_time: '18:00:00',
							leave_time: '08:00:00',
							day: 2,
							fk_location: 94,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 101,
							arrive_time: '10:30:00',
							leave_time: '15:00:00',
							day: 3,
							fk_location: 95,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 102,
							arrive_time: '18:00:00',
							leave_time: '08:00:00',
							day: 3,
							fk_location: 96,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 103,
							arrive_time: '10:00:00',
							leave_time: '12:00:00',
							day: 4,
							fk_location: 97,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 104,
							arrive_time: '14:00:00',
							leave_time: '18:00:00',
							day: 4,
							fk_location: 98,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 105,
							arrive_time: '19:00:00',
							leave_time: '08:00:00',
							day: 4,
							fk_location: 99,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 106,
							arrive_time: '10:00:00',
							leave_time: '14:00:00',
							day: 5,
							fk_location: 100,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 107,
							arrive_time: '16:00:00',
							leave_time: '18:00:00',
							day: 5,
							fk_location: 101,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 108,
							arrive_time: '21:30:00',
							leave_time: '08:00:00',
							day: 5,
							fk_location: 102,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 109,
							arrive_time: '10:00:00',
							leave_time: '12:30:00',
							day: 6,
							fk_location: 103,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 110,
							arrive_time: '14:00:00',
							leave_time: '17:00:00',
							day: 6,
							fk_location: 104,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 111,
							arrive_time: '18:30:00',
							leave_time: '20:30:00',
							day: 6,
							fk_location: 105,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 112,
							arrive_time: '21:30:00',
							leave_time: '09:30:00',
							day: 6,
							fk_location: 102,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 113,
							arrive_time: '10:30:00',
							leave_time: '11:30:00',
							day: 7,
							fk_location: 106,
							fk_tour: 7,
							fk_transport: 3
						},
						{
							id: 114,
							arrive_time: '12:30:00',
							leave_time: '13:15:00',
							day: 7,
							fk_location: 92,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 115,
							arrive_time: '15:00:00',
							leave_time: '19:00:00',
							day: 7,
							fk_location: 107,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 116,
							arrive_time: '21:00:00',
							leave_time: '10:00:00',
							day: 7,
							fk_location: 109,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 117,
							arrive_time: '13:00:00',
							leave_time: '19:00:00',
							day: 8,
							fk_location: 108,
							fk_tour: 7,
							fk_transport: 1
						},
						{
							id: 118,
							arrive_time: '21:00:00',
							leave_time: '22:30:00',
							day: 8,
							fk_location: 92,
							fk_tour: 7,
							fk_transport: 3
						},
					]),
					queryInterface.bulkInsert('tour_countries', [
						{
							fk_tour: 7,
							fk_country: 2,
						},
					]),
					queryInterface.bulkInsert('tour_provinces', [
						{
							fk_tour: 7,
							fk_province: 97
						},
						{
							fk_tour: 7,
							fk_province: 98
						},
						{
							fk_tour: 7,
							fk_province: 99
						},
						{
							fk_tour: 7,
							fk_province: 100
						},
						{
							fk_tour: 7,
							fk_province: 102
						},
						{
							fk_tour: 7,
							fk_province: 103
						},
					])
				])
			}),
			queryInterface.bulkInsert('tours', [
				{
					id: 8,
					name: 'Vòng quanh Thổ Nhĩ Kỳ',
					description: 'Chiêm ngưỡng The Blue Mosque - Giáo đường Xanh lộng lẫy, những điểm du lịch kỳ thú như di tích thành cổ Troy, quảng trường Hippodrome của những võ sĩ giác đấu thời Trung cổ hay viếng Cung điện Topkapi lớn nhất đế quốc Ottaman nay là bảo tàng lưu giữ nhiều cổ vật quý.' +
						'- Trải nghiệm du thuyền Bosphorus thưởng ngoạn cảnh quan hai bên bờ eo biển và cảng biển nổi tiếng Golden Horn, ngắm cung điện Dolmabahce và cây cầu Bosphorus nổi tiếng nối liền hai lục địa Á - Âu.' +
						'- Khám phá chợ lồng Bazaar với những âm thanh thủ thỉ thuyết phục của những anh chàng bán hàng người Thổ “điển trai”giữa bức phông màn sắc màu rực rỡ của hàng hóa',
					detail: 'Ngày 1: ISTANBUL - CANAKKALE - TROY.  Di chuyển đến vùng đất Canakkale. Tham quan Thành cổ Troy. Nghỉ đêm tại Canakkale. (Ăn sáng, trưa, chiều).' +
						'Ngày 2: CANAKKALE - EPHESUS - KUSADASI. Trả phòng. Khởi hành đến thành phố biển Kusadasi. Trên đường đi dừng chân khám phá thành phố cổ đại Ephesus. Nghỉ đêm tại Kusadasi. (Ăn sáng, trưa, chiều).' +
						'Ngày 3: KUSADASI -  PAMUKKALE. Trả phòng. Di chuyển đến Pamukkale. Chiêm ngưỡng những tàn tích còn sót lại của thành phố cổ linh thiêng Hierapolis. Tiếp tục khám phá di sản thiên nhiên thế giới “Lâu Đài Bông”. Nghỉ đêm tại Pamukkale. (Ăn sáng, trưa, tối).' +
						'Ngày 4: PAMUKKALE - KONYA - CAPPADOCIA. Trả phòng. Di chuyển đến vùng đất linh thiêng Konya. Tham quan Bảo tàng Philosopher Mevlana Celaleddin-I Rumi. Tiếp tục hành trình đến Cappadocia. Trên đường đi, ghé thăm Caravanserai. Chiêm ngưỡng chương trình biểu diễn Ánh Sáng 3D trên đá Zelve Mapping (tùy theo điều kiện thời tiết). Nghỉ đêm tại Cappadocia. (Ăn sáng, trưa, tối).' +
						'Ngày 5: CAPPADOCIA. Khám phá Cappadocia: tham quan Bảo tàng ngoài trời Goreme Open Air Museum. Tiếp tục di chuyển đến Làng cổ Avanos. Thành phố ngầm Kaymakli hoặc Ozkonak. Thưởng thức chương trình biểu diễn ca múa nhạc truyền thống địa phương Turkish Night Dance. Nghỉ đêm tại Cappadocia. (Ăn sáng, trưa, tối).' +
						'Ngày 6: CAPPADOCIA - ISTANBUL. Quý khách có thể ngắm cảnh bình minh ở Cappadocia trên khinh khí cầu và tận hưởng một quang cảnh vô cùng độc đáo, ấn tượng (chi phí tự túc + nếu điều kiện thời tiết cho phép). Trả phòng. Di chuyển ra sân bay đáp chuyến bay nội địa về Istanbul. Trải nghiệm du ngoạn bằng tàu dọc eo biển Bosphorus, ngắm cây cầu Bosphorus nổi tiếng xuyên biển và nối liền 2 lục địa Á - Âu. Chiêm ngưỡng các kiến trúc đặc trưng và các hoạt động thường ngày của người dân địa phương dọc theo con sông. Tự do mua sắm tại Chợ lồng Grand Bazaar.  Kết thúc tour du lịch. (Ăn sáng, trưa, tối).',
					featured_img: 'TNK_featured_image.PNG',
					policy: 'GIÁ TOUR ĐÃ BAO GỒM:' +
						'-  Vé máy bay.' +
						'- Thuế và các khoản phụ thu của hàng không.' +
						'- Khách sạn 5* tiêu chuẩn quốc tế (phòng đôi).' +
						'- Nước uống trên xe 0.5l/ khách/ngày' +
						'- Các bữa ăn được liệt kê theo chương trình.' +
						'- Vé tham quan theo chương trình.' +
						'- Hướng dẫn viên của công ty đi theo suốt tuyến.' +
						'- Xe máy lạnh sử dụng theo chương trình.' +
						'GIÁ TOUR KHÔNG BAO GỒM:' +
						'- Phí phòng đơn (dành cho khách yêu cầu ở phòng đơn): ' +
						'- Nước uống (bia rượu trong bữa ăn), điện thoại, giặt ủi, hành lý quá cước theo quy định của hàng không.' +
						'- Chi phí cá nhân của khách ngoài chương trình.' +
						'- Chi phí nâng hạng vé máy bay. ' +
						'GIÁ TOUR DÀNH CHO TRẺ EM:' +
						'- Trẻ em dưới 2 tuổi: 30% giá tour người lớn.' +
						'- Trẻ em từ 2 tuổi đến dưới 12 tuổi: 85% giá tour người lớn (không có chế độ giường riêng).' +
						'- Trẻ em từ 2 tuổi đến dưới 12 tuổi: 100% giá tour người lớn (có chế độ giường riêng).' +
						'- Trẻ em đủ 12 tuổi trở lên: 100% giá tour người lớn.' +
						'ĐIỀU KHOẢN HỦY TOUR:' +
						'- Trước ngày khỏi hành từ 7 - 10 ngày hoàn lại lệ phí 80%.' +
						'- Trước ngày khỏi hành từ 4 -6 ngày hoàn lại lệ phí 30%.' +
						'-  Trước ngày khỏi hành sau 4 ngày hoàn lại lệ phí 0%.'
				}
			]).then(() => {
				return Promise.all([
					queryInterface.bulkInsert('tour_images', [
						{
							id: 76,
							name: 'TNK_1.png',
							fk_tour: 8,
						},
						{
							id: 77,
							name: 'TNK_2.png',
							fk_tour: 8,
						},
						{
							id: 78,
							name: 'TNK_3.png',
							fk_tour: 8,
						},
						{
							id: 79,
							name: 'TNK_4.png',
							fk_tour: 8,
						},
						{
							id: 80,
							name: 'TNK_5.png',
							fk_tour: 8,
						},
						{
							id: 81,
							name: 'TNK_6.png',
							fk_tour: 8,
						},
						{
							id: 82,
							name: 'TNK_7.png',
							fk_tour: 8,
						},
						{
							id: 83,
							name: 'TNK_8.png',
							fk_tour: 8,
						},
						{
							id: 84,
							name: 'TNK_9.png',
							fk_tour: 8,
						},
						{
							id: 85,
							name: 'TNK_10.png',
							fk_tour: 8,
						},
						{
							id: 86,
							name: 'TNK_11.png',
							fk_tour: 8,
						},
						{
							id: 87,
							name: 'TNK_12.png',
							fk_tour: 8,
						},
					]),
					queryInterface.bulkInsert('routes', [
						{
							id: 119,
							arrive_time: '10:30:00',
							leave_time: '15:30:00',
							day: 1,
							fk_location: 93,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 120,
							arrive_time: '18:00:00',
							leave_time: '08:00:00',
							day: 1,
							fk_location: 94,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 121,
							arrive_time: '10:30:00',
							leave_time: '15:00:00',
							day: 2,
							fk_location: 95,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 122,
							arrive_time: '18:00:00',
							leave_time: '08:00:00',
							day: 2,
							fk_location: 96,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 123,
							arrive_time: '10:00:00',
							leave_time: '12:00:00',
							day: 3,
							fk_location: 97,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 124,
							arrive_time: '14:00:00',
							leave_time: '18:00:00',
							day: 3,
							fk_location: 98,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 125,
							arrive_time: '19:00:00',
							leave_time: '08:00:00',
							day: 3,
							fk_location: 99,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 126,
							arrive_time: '10:00:00',
							leave_time: '14:00:00',
							day: 4,
							fk_location: 100,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 127,
							arrive_time: '16:00:00',
							leave_time: '18:00:00',
							day: 4,
							fk_location: 101,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 128,
							arrive_time: '21:30:00',
							leave_time: '08:00:00',
							day: 4,
							fk_location: 102,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 129,
							arrive_time: '10:00:00',
							leave_time: '12:30:00',
							day: 5,
							fk_location: 103,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 130,
							arrive_time: '14:00:00',
							leave_time: '17:00:00',
							day: 5,
							fk_location: 104,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 131,
							arrive_time: '18:30:00',
							leave_time: '20:30:00',
							day: 5,
							fk_location: 105,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 132,
							arrive_time: '21:30:00',
							leave_time: '09:30:00',
							day: 5,
							fk_location: 102,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 133,
							arrive_time: '10:30:00',
							leave_time: '11:30:00',
							day: 6,
							fk_location: 106,
							fk_tour: 8,
							fk_transport: 3
						},
						{
							id: 134,
							arrive_time: '12:30:00',
							leave_time: '13:15:00',
							day: 6,
							fk_location: 92,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 135,
							arrive_time: '14:50:00',
							leave_time: '17:00:00',
							day: 6,
							fk_location: 107,
							fk_tour: 8,
							fk_transport: 1
						},
						{
							id: 136,
							arrive_time: '19:00:00',
							leave_time: null,
							day: 6,
							fk_location: 108,
							fk_tour: 8,
							fk_transport: 1
						},
					]),
					queryInterface.bulkInsert('tour_countries', [
						{
							fk_tour: 8,
							fk_country: 2,
						},
					]),
					queryInterface.bulkInsert('tour_provinces', [
						{
							fk_tour: 8,
							fk_province: 97
						},
						{
							fk_tour: 8,
							fk_province: 98
						},
						{
							fk_tour: 8,
							fk_province: 100
						},
						{
							fk_tour: 8,
							fk_province: 101
						},
						{
							fk_tour: 8,
							fk_province: 102
						},
						{
							fk_tour: 8,
							fk_province: 104
						},
					]),
				])
			})
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
			queryInterface.bulkDelete('tour_images', {
				fk_tour: 7
			}, {}).then(() => {
				return Promise.all([
					queryInterface.bulkDelete('tour_countries', {
						fk_tour: 7
					}, {}),
					queryInterface.bulkDelete('tour_provinces', {
						fk_tour: 7
					}, {}),
					queryInterface.bulkDelete('routes', {
						fk_tour: 7
					}, {}),
				]).then(() => {
					return queryInterface.bulkDelete('tours', {
						id: 7
					}, {})
				})
			}),
			queryInterface.bulkDelete('tour_images', {
				fk_tour: 8
			}, {}).then(() => {
				return Promise.all([
					queryInterface.bulkDelete('tour_countries', {
						fk_tour: 8
					}, {}),
					queryInterface.bulkDelete('tour_provinces', {
						fk_tour: 8
					}, {}),
					queryInterface.bulkDelete('routes', {
						fk_tour: 8
					}, {}),
				]).then(() => {
					return queryInterface.bulkDelete('tours', {
						id: 8
					}, {})
				})
			}),
		]).then(() => {
			return queryInterface.bulkDelete('provinces', {
				id: {
					[Sequelize.Op.or]: [97, 98, 99, 100, 101, 102, 103, 104]
				}
			}).then(() => {
				return Promise.all([
					queryInterface.bulkDelete('countries', {
						id: 2 //delete Thổ Nhĩ Kỳ
					}),
					queryInterface.bulkDelete('locations', {
						id: {
							[Sequelize.Op.or]: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
						}
					}),
				]);
			})
		});
	}
};
