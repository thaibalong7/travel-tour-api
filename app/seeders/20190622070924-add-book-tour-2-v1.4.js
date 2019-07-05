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

// Random number from 0 to length
const randomNumber = (length) => {
	return Math.floor(Math.random() * length)
}

// Generate Pseudo Random String, if safety is important use dedicated crypto/math library for less possible collisions!
const generateCode = async (length) => {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let text = "";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(randomNumber(possible.length));
	}
	return text;
}

function book_tour_history(id, code, book_time, status, num_passenger, total_pay, fk_contact_info, fk_tour_turn, fk_payment, fk_staff, message_pay) {
	const _book_tour_history = {};
	_book_tour_history.id = id;
	_book_tour_history.code = code;
	_book_tour_history.book_time = book_time;
	_book_tour_history.status = status;
	_book_tour_history.num_passenger = num_passenger;
	_book_tour_history.total_pay = total_pay;
	_book_tour_history.fk_contact_info = fk_contact_info;
	_book_tour_history.fk_tour_turn = fk_tour_turn;
	_book_tour_history.fk_payment = fk_payment;
	_book_tour_history.fk_staff = fk_staff;
	_book_tour_history.message_pay = JSON.stringify(message_pay);

	return _book_tour_history;
}

function cancel_book_tour(id, fk_book_tour, fk_user, fk_staff, request_message, request_time, confirm_time, refund_period, money_refunded, refunded_time, refund_message, request_offline_person) {
	return {
		id: id,
		fk_book_tour: fk_book_tour,
		fk_user: fk_user,
		fk_staff: fk_staff,
		request_message: request_message,
		request_time: request_time,
		confirm_time: confirm_time,
		refund_period: refund_period,
		money_refunded: money_refunded,
		refund_message: JSON.stringify(refund_message),
		refunded_time: refunded_time,
		request_offline_person: JSON.stringify(request_offline_person)
	}
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
		return queryInterface.sequelize.query("INSERT INTO `tour_turns` (`id`, `start_date`, `end_date`, `num_current_people`, `num_max_people`, `price`, `discount`, `view`, `status`, `fk_tour`, `code`, `booking_term`, `payment_term`, `isHoliday`) VALUES" +
			"(24, '" + formatDate(-73) + "', '" + formatDate(-68) + "', 6, 30, 6000000, 0, 294, 'public', 5, '548EP8VD', 5, 2, false)," +
			"(25, '" + formatDate(-161) + "', '" + formatDate(-159) + "', 10, 25, 1100000, 0, 247, 'public', 3, '4APW9WU8', 6, 4, false)," +
			"(26, '" + formatDate(-128) + "', '" + formatDate(-126) + "', 8, 25, 1200000, 0, 356, 'public', 3, '25FDDC7S', 6, 4, false)," +
			"(27, '" + formatDate(-95) + "', '" + formatDate(-95) + "', 14, 20, 180000, 0, 321, 'public', 4, '25FKDC7S', 4, 2, false)," +
			"(28, '" + formatDate(-98) + "', '" + formatDate(-96) + "', 5, 30, 1400000, 0, 364, 'public', 3, '4DFKYC7S', 5, 4, false)," +
			"(29, '" + formatDate(-7) + "', '" + formatDate(-5) + "', 6, 30, 1200000, 0, 304, 'public', 3, '5SDO41V9', 5, 3, false)," +
			"(30, '" + formatDate(-37) + "', '" + formatDate(-37) + "', 7, 30, 150000, 0, 355, 'public', 2, '25F5D6SD', 5, 3, false)," +
			"(31, '" + formatDate(-54) + "', '" + formatDate(-51) + "', 6, 20, 1300000, 0, 248, 'public', 3, '54SDW9W2', 6, 4, false)," +
			"(32, '" + formatDate(-1) + "', '" + formatDate(-1) + "', 3, 25, 170000, 0, 354, 'public', 4, '8WF8S4GD', 4, 2, false)," +
			"(40, '" + formatDate(-68) + "', '" + formatDate(-68) + "', 10, 20, 100000, 0, 451, 'public', 1, 'HW8W8FSS', 4, 2, false)," +
			"(23, '" + formatDate(-115) + "', '" + formatDate(-115) + "', 6, 20, 150000, 0, 451, 'public', 2, '54FDE8E9', 5, 3, false);"
		).then(async () => {


			return Promise.all([queryInterface.sequelize.query("INSERT INTO `price_passenger` (`id`, `percent`, `fk_tourturn`, `fk_type_passenger`) VALUES" +
				"(59, 100, 23, 1)," + //150,000 VND
				"(61, 100, 24, 1)," + //6,000,000 VND
				"(62, 45, 24, 2)," + //2,700,000 VND
				"(63, 100, 25, 1)," + //1,100,000 VND
				"(64, 50, 25, 2)," + //550,000 VND
				"(65, 100, 26, 1)," + //1,200,000 VND
				"(66, 50, 26, 2)," + //600,000 VND
				"(67, 100, 27, 1)," + //180,000 VND
				"(68, 50, 27, 2)," + //90,000 VND
				"(69, 100, 28, 1)," + //1,400,000 VND
				"(70, 50, 28, 2)," + //700,000 VND
				"(71, 100, 29, 1)," + //1,200,000 VND
				"(72, 50, 29, 2)," + //600,000 VND
				"(73, 100, 30, 1)," + //150,000 VND
				"(74, 40, 30, 2)," + //60,000 VND
				"(75, 100, 31, 1)," + //1,300,000 VND
				"(76, 38, 31, 2)," + //500,000 VND
				"(77, 100, 32, 1)," + //170,000 VND
				"(78, 41, 32, 2)," + //70,000 VND
				"(79, 100, 33, 1)," + //100,000 VND
				"(80, 50, 33, 2)," + //50,000 VND
				"(60, 50, 23, 2);"	//75,000 VND
			),


			queryInterface.sequelize.query("INSERT INTO `book_tour_contact_info` (`id`, `email`, `fullname`, `phone`, `address`, `fk_user`, `passport`) VALUES" +
				"(25, 'lvntien@gmail.com', 'Lê Văn Ngọc Tiến', '0333655462', '154 Lý Thường Kiệt, Quận 10, TP HCM', NULL, '233000126')," +
				"(24, 'tttan@gmail.com', 'Trương Tiên Tân', '0366455128', '158/30 Đường số 6, Quận Thủ Đức, TP HCM', NULL, '245551662')," +
				"(26, 'tnmuu@gmail.com', 'Trương Nhuệ Mưu', '0333165468', '05 khu phố 3 Phường 4, Quận 5, TP HCM', NULL, '313654849')," +
				"(27, 'nthang@gmail.com', 'Ngô Thanh Hằng', '0364555498', '156 khu phố Tân Lập, Dĩ An, Bình Dương', 12, '655499510')," +
				"(28, 'dtdung@gmail.com', 'Đoàn Tiến Dũng', '0364555641', '16 Hàng Bè, Hà Nội', NULL, '266549850')," +
				"(29, 'plnthanh@gmail.com', 'Phạm Lê Ngọc Thành', '0765555641', '504, Provincial Road 43, Tam Phu Ward, Thu Duc District, Bình Chiểu, Hồ Chí Minh', NULL, '233168461')," +
				"(30, 'ntmchi@gmail.com', 'Nguyễn Thị Mỹ Chi', '0344567578', '29 A Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, Hồ Chí Minh', NULL, '124333561')," +
				"(31, 'lvvu@gmail.com', 'Lương Văn Vũ', '0364666521', '104/4-1, Đường số 2A, Khu Công Nghiệp Amata, Long Bình, Thành phố Biên Hòa, Đồng Nai', NULL, '213654441')," +
				"(32, 'vtttrang@gmail.com', 'Vũ Thị Thùy Trang', '0216666541', '105B Hà Huy Giáp, Quyết Thắng, Thành phố Biên Hòa, Đồng Nai', 12, '230001210')," +
				"(33, 'dvly@gmail.com', 'Đặng Văn Lý', '0366452157', '59, 4 Khu Phố Hòa Lân 1, Thuận Giao, Tx.Thuận An, Bình Dương', NULL, '321211026')," +
				"(34, 'cxha@gmail.com', 'Cao Xuân Hà', '0754555126', '314 Lê Thị Riêng, Tân Thới An, Quận 12, Hồ Chí Minh, Việt Nam', NULL, '211333215')," +
				"(35, 'dttvi@gmail.com', 'Đinh Thị Thảo Vy', '0345555120', '161B/112 Lạc Long Quân, Phường 3, Quận 11, Hồ Chí Minh, Việt Nam', NULL, '233649874')," +
				"(36, 'nthphuong@gmail.com', 'Nguyễn Thị Hải Phượng', '0365554985', '45 Đặng Lộ, Phường 7, Tân Bình, Hồ Chí Minh, Việt Nam', NULL, '261549850')," +
				"(37, 'nndu@gmail.com', 'Nguyễn Hoàng Dư', '0364555100', '71 Chế Lan Viên, Phường 15, Tân Phú, Hồ Chí Minh, Việt Nam', NULL, '655454554')," +
				"(38, 'ptnthuy@gmail.com', 'Phạm Thị Ngọc Thuý', '0365498887', '102 Đường Hậu Giang, Phường 5, Quận 6, Hồ Chí Minh, Việt Nam', NULL, '264999870')," +
				"(39, 'ttdoan@gmail.com', 'Trần Thạch Đoàn', '0364666878', '1353 Tổ 4, Kp. Phước Hải, Tân Uyên, Bình Dương, Việt Nam', NULL, '511222165')," +
				"(40, 'lntuan@gmail.com', 'Lý Nam Tuấn', '0124444238', 'Tân Hải, Tân Thành, Bà Rịa - Vũng Tàu, Việt Nam', NULL, '124444370')," +
				"(41, 'nlnanh@gmail.com', 'Nguyễn Lê Ngọc Ánh', '0465466651', 'Mỹ Xuân, Tân Thành, Khu công nghiệp Mỹ Xuân B1, Mỹ Xuân, Việt Nam', NULL, '264111038')," +
				"(42, 'lhblong@gmail.com', 'Hoàng Lê Bảo Long', '0311654445', '20 Võ Văn Tần, Phường 2, Tân An, Long An, Việt Nam', NULL, '332166624')," +
				"(43, 'ntphat@gmail.com', 'Nguyễn Tấn Phát', '0124444374', '15/2 Mai Bá Hương, Phường 5, Tân An, Long An, Việt Nam', NULL, '321555468')," +
				"(44, 'hhthien@gmail.com', 'Huỳnh Hoàng Thiện', '0354684798', 'Khu Phố 1, Xã Tân Bửu, Huyện Bến Lức, Tân Bửu, Bến Lức, Long An, Việt Nam', NULL, '846565465')," +
				"(45, 'ntathu@gmail.com', 'Nguyễn Thị Anh Thư', '0315555468', 'Nguyễn Văn Linh, TT. Tân Túc, Bình Chánh, Hồ Chí Minh, Việt Nam', NULL, '350568468')," +
				"(46, 'dtnhan@gmail.com', 'Đỗ Thành Nhân', '0422216548', '48 An Dương Vương, Phường 16, Quận 8, Hồ Chí Minh, Việt Nam', NULL, '068468687')," +
				"(47, 'llqgiao@gmail.com', 'Lê Lưu Quỳnh Giao', '0765465135', '31/1B Đường Nguyễn Ảnh Thủ, Trung Mỹ Tây, Hóc Môn, Hồ Chí Minh, Việt Nam', NULL, '354484988')," +
				"(48, 'hchau@gmail.com', 'Huỳnh Công Hậu', '0321564684', '139 Phan Anh, Bình Trị Đông, Bình Tân, Hồ Chí Minh, Việt Nam', NULL, '213222168')," +
				"(49, 'nhphuoc@gmail.com', 'Nguyễn Hữu Phúc', '0232165468', '235/10 Thạnh Xuân 14, Thạnh Xuân, Quận 12, Hồ Chí Minh, Việt Nam', NULL, '846555462')," +
				"(50, 'ptplinh@gmail.com', 'Phạm Thị Phương Linh', '0354565489', 'Phú Hữu, Nhơn Trạch, Đồng Nai, Việt Nam', NULL, '354658889')," +
				"(51, 'ntnhan@gmail.com', 'Nguyễn Trọng Nhân ', '0565132154', '59 Nguyễn Chí Thanh, Tương Bình Hiệp, Thủ Dầu Một, Bình Dương, Việt Nam', NULL, '132355658')," +
				"(52, 'ptthuy@gmail.com', 'Phạm Thị Thùy', '0654654215', 'Tổ 6, Khu Phố, Tân Uyên, Bình Dương, Việt Nam', NULL, '465654868')," +
				"(53, 'tttthao@gmail.com', 'Trần Thị Thu Thảo', '0321546548', 'Số 90, Đường Trương Định, Phường 2, Thị Xã Gò Công, Phường 2, Gò Công, Tiền Giang, Việt Nam', NULL, '124654878')," +
				"(54, 'ttphong@gmail.com', 'Từ Thái Phong', '0546543554', 'Ấp 4, Bến Lức, Long An, Việt Nam', NULL, '265468468')," +
				"(55, 'tahuy@gmail.com', 'Trương Anh Huy', '0345686830', '115 Lê Duẩn, TT. Long Thành, Long Thành, Đồng Nai, Việt Nam', NULL, '006546546')," +
				"(56, 'hvphu@gmail.com', 'Huỳnh Văn Phú', '0546515468', '1 Phan Trung, Tân Mai, Thành phố Biên Hòa, Đồng Nai, Việt Nam', NULL, '655465486')," +
				"(57, 'ddhau@gmail.com', 'Đỗ Đình Hậu', '0354686848', '385 Nguyễn Văn Tăng, Long Thạnh Mỹ, 9, Hồ Chí Minh, Việt Nam', NULL, '246544898')," +
				"(58, 'ltdat@gmail.com', 'Lê Tấn Đạt', '0546898688', 'Lý Thái Tổ, Phú Hữu, Nhơn Trạch, Đồng Nai, Việt Nam', NULL, '549879898')," +
				"(59, 'sdfee@gmail.com', 'Dương Hoài Phương', '0754545424', 'Lô F2A, Đường số 2, KCN, Tân Kim, Cần Giuộc, Long An, Việt Nam', NULL, '165468788')," +
				"(60, 'cvbgfh@gmail.com', 'Phan Vinh Bính', '0546846868', 'QL50, Tân Kim, Cần Giuộc, Long An, Việt Nam', NULL, '258468888')," +
				"(61, 'dfsdf@gmail.com', 'Võ Minh Thư', '0546848688', 'C8/148A/1, Đa Phước, Bình Chánh, Hồ Chí Minh, Việt Nam', NULL, '035354548')," +
				"(62, 'fghfgh@gmail.com', 'Phan Huỳnh Ngọc Dung', '0546848888', 'Số 2, Nguyễn Văn Tiếp, Phường 5, Tân An, Long An, Việt Nam', NULL, '998786544')," +
				"(63, 'ghjghjg@gmail.com', 'Nguyễn Thế Vinh', '0321532154', '45 Đoàn Thị Mối, Nhuận Đức, Củ Chi, Hồ Chí Minh, Việt Nam', NULL, '154468777')," +
				"(64, 'ygjgh@gmail.com', 'Lê Minh Vương', '0321354543', '712 Cách Mạng Tháng Tám, Hiệp Ninh, Tây Ninh, Việt Nam', NULL, '213544687')," +
				"(65, 'vghvgh@gmail.com', 'Trương Gia Mẫn', '0354868877', 'An Lập, Dầu Tiếng, Bình Dương, Việt Nam', NULL, '321435468')," +
				"(66, 'jghjft@gmail.com', 'Châu Thị Kim Anh', '0478465465', 'Nguyễn Văn Trỗi, TT. Long Điền, Long Điền, Bà Rịa - Vũng Tàu, Việt Nam', NULL, '213545488')," +
				"(67, 'fge4e4@gmail.com', 'Nguyễn Minh Châu', '0654688777', 'TT. Long Hải, Long Điền, Bà Rịa - Vũng Tàu, Việt Nam', NULL, '354987988')," +
				"(68, 'dfgdrg4@gmail.com', 'Lê Trung Kiên', '0354548987', 'Đường số 1, TT. Long Hải, Long Điền, Bà Rịa - Vũng Tàu, Việt Nam', NULL, '688798987')," +
				"(69, 'sdfsde8@gmail.com', 'Phạm Hoàng Nam Trung', '0689786541', 'Long Hoà, Cần Giờ, Hồ Chí Minh, Việt Nam', NULL, '546878888')," +
				"(23, 'lnlong@gmail.com', 'Lê Ngọc Long', '0326664516', '14E Trần Phú, Quận 3, TP HCM', NULL, '233122016');")
			]).then(async () => {
				//insert book tour history
				//then insert passenger


				return queryInterface.bulkInsert('book_tour_history', [
					book_tour_history(24, await generateCode(8), formatDate(-119) + " 09:30:00", 'finished', 1, 150000, 23, 23, 1, 3, { "name": "Trương Tiên Tân", "passport": "245551662", "note": "", "helper": false }),
					book_tour_history(23, await generateCode(8), formatDate(-130) + " 09:25:08", 'finished', 1, 150000, 24, 23, 1, 2, { "name": "Lê Ngọc Long", "passport": "233122016", "note": "", "helper": false }),
					book_tour_history(25, await generateCode(8), formatDate(-145) + " 06:08:00", 'finished', 1, 150000, 25, 23, 2, 2, { "name": "Lê Văn Ngọc Tiến", "passport": "233000126", "note": "", "helper": false }),
					book_tour_history(26, await generateCode(8), formatDate(-123) + " 15:07:00", 'finished', 3, 375000, 26, 23, 1, 2, { "name": "Trương Nhuệ Mưu", "passport": "313654849", "note": "", "helper": false }),
					book_tour_history(27, await generateCode(8), formatDate(-83) + " 16:26:00", 'finished', 2, 12000000, 27, 24, 3, 2, { "name": "Ngô Thanh Hằng", "passport": "655499510", "note": "", "helper": false }),
					book_tour_history(28, await generateCode(8), formatDate(-99) + " 13:45:00", 'finished', 1, 6000000, 28, 24, 1, 2, { "name": "Đoàn Tiến Dũng", "passport": "266549850", "note": "", "helper": false }),
					book_tour_history(29, await generateCode(8), formatDate(-175) + " 17:57:00", 'finished', 3, 14700000, 29, 24, 1, 2, { "name": "Phạm Lê Ngọc Thành", "passport": "233168461", "note": "", "helper": false }),
					book_tour_history(30, await generateCode(8), formatDate(-172) + " 04:17:00", 'finished', 2, 2200000, 30, 25, 3, 3, { "name": "Nguyễn Thị Mỹ Chi", "passport": "124333561", "note": "", "helper": false }),
					book_tour_history(31, await generateCode(8), formatDate(-181) + " 03:26:22", 'finished', 1, 1100000, 31, 25, 2, 3, { "name": "Lương Văn Vũ", "passport": "213654441", "note": "", "helper": false }),
					book_tour_history(32, await generateCode(8), formatDate(-169) + " 21:30:24", 'finished', 2, 1650000, 32, 25, 2, 2, { "name": "Lê Văn Vàng", "passport": "203331201", "note": "Chồng tới thanh toán", "helper": true }),
					book_tour_history(33, await generateCode(8), formatDate(-189) + " 04:14:27", 'finished', 5, 5500000, 33, 25, 1, 3, { "name": "Đặng Văn Lý", "passport": "321211026", "note": "", "helper": false }),
					book_tour_history(34, await generateCode(8), formatDate(-142) + " 01:41:00", 'finished', 4, 4800000, 34, 26, 2, 3, { "name": "Cao Xuân Hà", "passport": "211333215", "note": "", "helper": false }),
					book_tour_history(35, await generateCode(8), formatDate(-152) + " 14:17:00", 'finished', 1, 1200000, 35, 26, 2, 2, { "name": "Đinh Thị Thảo Vy", "passport": "233649874", "note": "", "helper": false }),
					book_tour_history(36, await generateCode(8), formatDate(-175) + " 23:05:00", 'finished', 3, 3600000, 36, 26, 3, 2, { "name": "Nguyễn Thị Hải Phượng", "passport": "261549850", "note": "", "helper": false }),
					book_tour_history(37, await generateCode(8), formatDate(-110) + " 22:34:00", 'finished', 3, 540000, 37, 27, 1, 2, { "name": "Nguyễn Hoàng Dư", "passport": "655454554", "note": "", "helper": false }),
					book_tour_history(38, await generateCode(8), formatDate(-105) + " 17:54:00", 'finished', 1, 180000, 38, 27, 1, 2, { "name": "Phạm Thị Ngọc Thuý", "passport": "264999870", "note": "", "helper": false }),
					book_tour_history(39, await generateCode(8), formatDate(-135) + " 04:17:00", 'finished', 1, 180000, 39, 27, 2, 2, { "name": "Trần Thạch Đoàn", "passport": "511222165", "note": "", "helper": false }),
					book_tour_history(40, await generateCode(8), formatDate(-120) + " 14:01:00", 'finished', 2, 360000, 40, 27, 2, 3, { "name": "Lý Nam Tuấn", "passport": "124444370", "note": "", "helper": false }),
					book_tour_history(41, await generateCode(8), formatDate(-167) + " 15:52:00", 'finished', 2, 360000, 41, 27, 1, 3, { "name": "Nguyễn Lê Ngọc Ánh", "passport": "264111038", "note": "", "helper": false }),
					book_tour_history(42, await generateCode(8), formatDate(-134) + " 14:42:00", 'finished', 5, 900000, 42, 27, 1, 3, { "name": "Nguyễn Lê Ngọc Ánh", "passport": "264111038", "note": "", "helper": true }),
					book_tour_history(43, await generateCode(8), formatDate(-120) + " 15:22:00", 'finished', 1, 1400000, 43, 28, 1, 2, { "name": "Nguyễn Tấn Phát", "passport": "321555468", "note": "", "helper": false }),
					book_tour_history(44, await generateCode(8), formatDate(-107) + " 04:11:00", 'finished', 2, 2800000, 44, 28, 3, 2, { "name": "Huỳnh Hoàng Thiện", "passport": "846565465", "note": "", "helper": false }),
					book_tour_history(45, await generateCode(8), formatDate(-122) + " 04:47:00", 'finished', 2, 2800000, 45, 28, 3, 2, { "name": "Nguyễn Thị Anh Thư", "passport": "350568468", "note": "", "helper": false }),
					book_tour_history(46, await generateCode(8), formatDate(-29) + " 05:28:00", 'finished', 2, 2400000, 46, 29, 2, 3, { "name": "Đỗ Thành Nhân", "passport": "068468687", "note": "", "helper": false }),
					book_tour_history(47, await generateCode(8), formatDate(-48) + " 08:37:00", 'finished', 2, 2400000, 47, 29, 1, 3, { "name": "Lê Lưu Quỳnh Giao", "passport": "354484988", "note": "", "helper": false }),
					book_tour_history(48, await generateCode(8), formatDate(-78) + " 16:28:00", 'finished', 2, 2400000, 48, 29, 2, 2, { "name": "Huỳnh Công Hậu", "passport": "213222168", "note": "", "helper": false }),
					book_tour_history(49, await generateCode(8), formatDate(-48) + " 18:45:00", 'finished', 1, 150000, 49, 30, 3, 2, { "name": "Nguyễn Hữu Phúc", "passport": "846555462", "note": "", "helper": false }),
					book_tour_history(50, await generateCode(8), formatDate(-102) + " 02:43:00", 'finished', 1, 150000, 50, 30, 3, 2, { "name": "Phạm Thị Phương Linh", "passport": "354658889", "note": "", "helper": false }),
					book_tour_history(51, await generateCode(8), formatDate(-68) + " 15:27:00", 'finished', 5, 660000, 51, 30, 1, 3, { "name": "Nguyễn Trọng Nhân", "passport": "132355658", "note": "", "helper": false }),
					book_tour_history(52, await generateCode(8), formatDate(-141) + " 07:41:00", 'finished', 3, 3100000, 52, 31, 1, 3, { "name": "Phạm Thị Thùy", "passport": "465654868", "note": "", "helper": false }),
					book_tour_history(53, await generateCode(8), formatDate(-111) + " 04:17:00", 'finished', 2, 2600000, 53, 31, 2, 3, { "name": "Trần Thị Thu Thảo", "passport": "124654878", "note": "", "helper": false }),
					book_tour_history(54, await generateCode(8), formatDate(-170) + " 15:24:00", 'finished', 1, 1300000, 54, 31, 2, 2, { "name": "Từ Thái Phong", "passport": "265468468", "note": "", "helper": false }),
					book_tour_history(55, await generateCode(8), formatDate(-37) + " 17:48:00", 'finished', 1, 170000, 55, 32, 1, 2, { "name": "Trương Anh Huy", "passport": "006546546", "note": "", "helper": false }),
					book_tour_history(56, await generateCode(8), formatDate(-73) + " 21:15:00", 'finished', 2, 340000, 56, 32, 1, 2, { "name": "Huỳnh Văn Phú", "passport": "655465486", "note": "", "helper": false }),
					book_tour_history(57, await generateCode(8), formatDate(-84) + " 18:27:00", 'finished', 5, 500000, 57, 40, 1, 2, { "name": "Đỗ Đình Hậu", "passport": "246544898", "note": "", "helper": false }),
					book_tour_history(58, await generateCode(8), formatDate(-95) + " 18:15:00", 'finished', 5, 500000, 58, 40, 2, 2, { "name": "Lê Tấn Đạt", "passport": "549879898", "note": "", "helper": false }),
					book_tour_history(59, await generateCode(8), formatDate(-9) + " 18:15:00", 'refunded', 1, 170000, 59, 32, 2, 2, { "name": "Dương Hoài Phương", "passport": "165468788", "note": "", "helper": false }),
					book_tour_history(60, await generateCode(8), formatDate(-46) + " 14:15:00", 'refunded', 1, 170000, 60, 32, 2, 2, { "name": "Phan Vinh Bính", "passport": "258468888", "note": "", "helper": false }),
					book_tour_history(61, await generateCode(8), formatDate(-48) + " 21:15:00", 'refunded', 1, 170000, 61, 32, 2, 3, { "name": "Võ Minh Thư", "passport": "035354548", "note": "", "helper": false }),
					book_tour_history(62, await generateCode(8), formatDate(-80) + " 23:06:00", 'refunded', 1, 120000, 62, 29, 2, 3, { "name": "Phan Huỳnh Ngọc Dung", "passport": "998786544", "note": "", "helper": false }),
					book_tour_history(63, await generateCode(8), formatDate(-110) + " 12:06:00", 'refunded', 1, 120000, 63, 29, 2, 3, { "name": "Nguyễn Thế Vinh", "passport": "154468777", "note": "", "helper": false }),
					book_tour_history(64, await generateCode(8), formatDate(-142) + " 15:24:00", 'refunded', 1, 130000, 64, 31, 1, 2, { "name": "Lê Minh Vương", "passport": "213544687", "note": "", "helper": false }),
					book_tour_history(65, await generateCode(8), formatDate(-176) + " 21:31:00", 'refunded', 1, 100000, 65, 40, 3, 2, { "name": "Trương Gia Mẫn", "passport": "321435468", "note": "", "helper": false }),
					book_tour_history(66, await generateCode(8), formatDate(-156) + " 20:39:00", 'refunded', 1, 1400000, 66, 28, 1, 2, { "name": "Châu Thị Kim Anh", "passport": "213545488", "note": "", "helper": false }),
					book_tour_history(67, await generateCode(8), formatDate(-162) + " 21:38:00", 'refunded', 1, 1400000, 67, 28, 1, 2, { "name": "Nguyễn Minh Châu", "passport": "354987988", "note": "", "helper": false }),
					book_tour_history(68, await generateCode(8), formatDate(-139) + " 20:33:00", 'refunded', 1, 1400000, 68, 28, 1, 3, { "name": "Lê Trung Kiên", "passport": "688798987", "note": "", "helper": false }),
					book_tour_history(69, await generateCode(8), formatDate(-86) + " 23:17:00", 'refunded', 1, 150000, 69, 30, 2, 3, { "name": "Phạm Hoàng Nam Trung", "passport": "546878888", "note": "", "helper": false }),
				]).then(() => {


					return Promise.all([
						queryInterface.sequelize.query("INSERT INTO `passengers` (`id`, `fullname`, `phone`, `birthdate`, `sex`, `passport`, `fk_book_tour`, `fk_type_passenger`) VALUES" +
							"(45, 'Trương Tiên Tân', '0366455128', '1985-09-07', 'male', '245551662', 24, 1)," +
							"(46, 'Lê Văn Ngọc Tiến', '0333655462', '1989-07-07', 'male', '233000126', 25, 1)," +
							"(47, 'Trương Nhuệ Mưu', '0333165468', '1992-01-14', 'female', '313654849', 26, 1)," +
							"(48, 'Hách Chí Bình', '0355465448', '1989-07-27', 'male', '233166549', 26, 1)," +
							"(49, 'Lê Văn Ngọc Tiến', NULL, '2011-11-07', 'male', NULL, 26, 2)," +
							"(50, 'Ngô Thanh Hằng', '0364555498', '1993-09-21', 'female', '655499510', 27, 1)," +
							"(51, 'Phạm Tuấn Tài', '0321566484', '1990-04-08', 'male', '322166513', 27, 1)," +
							"(52, 'Đoàn Tiến Dũng', '0364555641', '1991-08-23', 'male', '266549850', 28, 1)," +
							"(53, 'Phạm Lê Ngọc Thành', '0765555641', '1990-07-15', 'male', '233168461', 29, 1)," +
							"(54, 'Phạm Phương Mai', '0333264484', '1991-04-13', 'female', '322166513', 29, 1)," +
							"(55, 'Phạm Lê Hoàng Thùy', NULL, '2012-01-14', 'female', NULL, 29, 2)," +
							"(56, 'Nguyễn Thị Mỹ Chi', '0344567578', '1995-11-04', 'female', '124333561', 30, 1)," +
							"(57, 'Lý Thị Bảo Trân', '0364555120', '1995-05-30', 'female', '834455675', 30, 1)," +
							"(58, 'Lương Văn Vũ', '0364666521', '1991-01-21', 'male', '213654441', 31, 1)," +
							"(59, 'Vũ Thị Thùy Trang', '0216666541', '1989-04-13', 'female', '230001210', 32, 1)," +
							"(60, 'Lê Thị Thúy Phượng', NULL, '2012-04-04', 'female', NULL, 32, 2)," +
							"(61, 'Đặng Văn Lý', '0366452157', '1989-03-15', 'male', '321211026', 33, 1)," +
							"(62, 'Lý Văn Thanh', '0311154461', '1990-11-24', 'male', '231666541', 33, 1)," +
							"(63, 'Ngô Thị Phương Lan', '0322166549', '1994-12-15', 'female', '233013222', 33, 1)," +
							"(64, 'Phạm Mỹ Ngọc', '0754666215', '1987-02-02', 'female', '032165442', 33, 1)," +
							"(65, 'Trương Thị Mỹ Lan', '0546665120', '1990-05-24', 'female', '231655498', 33, 1)," +
							"(66, 'Cao Xuân Hà', '0754555126', '1991-01-14', 'male', '211333215', 34, 1)," +
							"(67, 'Phạm Việt Huy', '0264555684', '1991-06-14', 'male', '212222120', 34, 1)," +
							"(68, 'Cao Duy Lâm', '0756444562', '1991-01-17', 'male', '213222654', 34, 1)," +
							"(69, 'Trần Nhật Minh', '0364555659', '1990-04-10', 'male', '321555654', 34, 1)," +
							"(70, 'Đinh Thị Thảo Vy', '0345555120', '1996-07-18', 'female', '233649874', 35, 1)," +
							"(71, 'Nguyễn Thị Hải Phượng', '0365554985', '1995-01-24', 'female', '261549850', 36, 1)," +
							"(72, 'Nguyễn Thị Vân Anh', '0312553221', '1995-04-02', 'female', '321666512', 36, 1)," +
							"(73, 'Linh Thị Hồng Phượng', '0453222145', '1995-12-14', 'female', '622132665', 36, 1)," +
							"(74, 'Nguyễn Hoàng Dư', '0364555100', '1997-10-07', 'male', '655454554', 37, 1)," +
							"(75, 'Đoàn Tiến Đạt', '0655455121', '1998-04-14', 'male', '322122111', 37, 1)," +
							"(76, 'Lê Công Hậu', '0644512221', '1997-09-28', 'male', '033265565', 37, 1)," +
							"(77, 'Phạm Thị Ngọc Thuý', '0365498887', '1997-08-24', 'female', '264999870', 38, 1)," +
							"(78, 'Trần Thạch Đoàn', '0364666878', '1995-04-30', 'male', '511222165', 39, 1)," +
							"(79, 'Lý Nam Tuấn', '0124444238', '1995-08-10', 'male', '124444370', 40, 1)," +
							"(80, 'Hồ Nữ Hoàng Anh', '0364555128', '1997-11-15', 'female', '031165654', 40, 1)," +
							"(81, 'Nguyễn Lê Ngọc Ánh', '0465466651', '1995-05-05', 'female', '264111038', 41, 1)," +
							"(82, 'Đinh Huỳnh Minh Khuê', '0211444101', '1995-12-26', 'female', '213000121', 41, 1)," +
							"(83, 'Hoàng Lê Bảo Long', '0311654445', '1992-12-26', 'male', '332166624', 42, 1)," +
							"(84, 'Dương Văn Nhân ', '0321555465', '1994-03-26', 'male', '031121665', 42, 1)," +
							"(85, 'Phạm Huỳnh Thuỷ Phụng', '0455651112', '1994-09-26', 'female', '324666598', 42, 1)," +
							"(86, 'Trần Thị Thanh', '0644555465', '1994-03-26', 'female', '032111655', 42, 1)," +
							"(87, 'Phan Công Thành', '0764666554', '1993-06-26', 'male', '226655666', 42, 1)," +
							"(88, 'Nguyễn Tấn Phát', '0124444374', '1994-04-11', 'male', '321555468', 43, 1)," +
							"(89, 'Huỳnh Hoàng Thiện', '0354684798', '1992-04-27', 'male', '846565465', 44, 1)," +
							"(90, 'Huỳnh Minh Tú', '0321654879', '1994-01-03', 'female', '035465489', 44, 1)," +
							"(91, 'Nguyễn Thị Anh Thư', '0315555468', '1995-07-03', 'female', '350568468', 45, 1)," +
							"(92, 'Hồ Ngọc Huỳnh Mai', '0354654898', '1994-11-29', 'female', '232165654', 45, 1)," +
							"(93, 'Đỗ Thành Nhân', '0422216548', '1992-08-15', 'male', '068468687', 46, 1)," +
							"(94, 'Hoàng Thị Kim Chi', '04446151654', '1994-10-01', 'female', '546546548', 46, 1)," +
							"(95, 'Lê Lưu Quỳnh Giao', '0765465135', '1995-07-24', 'female', '354484988', 47, 1)," +
							"(96, 'Võ Thị Thu Hà', '0346555489', '1994-05-30', 'female', '264888791', 47, 1)," +
							"(97, 'Huỳnh Công Hậu', '0321564684', '1995-04-14', 'male', '213222168', 48, 1)," +
							"(98, 'Đỗ Nguyễn Khánh Ngân', '03465654321', '1999-12-05', 'female', '644555135', 48, 1)," +
							"(99, 'Nguyễn Hữu Phúc', '0232165468', '1993-07-28', 'male', '846555462', 49, 1)," +
							"(100, 'Phạm Thị Phương Linh', '0354565489', '1992-04-17', 'female', '354658889', 50, 1)," +
							"(101, 'Nguyễn Trọng Nhân', '0565132154', '1990-07-16', 'male', '132355658', 51, 1)," +
							"(102, 'Phạm Thị Yến Phi', '0213215656', '1992-04-14', 'female', '656555320', 51, 1)," +
							"(103, 'Lê Thị Kiều Trang', '0354654868', '1994-11-04', 'female', '654499954', 51, 1)," +
							"(104, 'Tạ Quang Tuấn', '0654683204', '1991-07-17', 'male', '354654588', 51, 1)," +
							"(105, 'Nguyễn Thanh Sang', 'NULL', '2013-06-26', 'male', NULL, 51, 2)," +
							"(106, 'Phạm Thị Thùy', '0654654215', '1990-11-04', 'female', '465654868', 52, 1)," +
							"(107, 'Phạm Lê Hoàng Phúc', '0321546546', '1988-04-14', 'male', '132555620', 52, 1)," +
							"(108, 'Phạm Trọng Ân', 'NULL', '2012-06-26', 'male', NULL, 52, 2)," +
							"(109, 'Trần Thị Thu Thảo', '0321546548', '1993-03-12', 'female', '124654878', 53, 1)," +
							"(110, 'Nguyễn Mỹ Anh', '0354654898', '1992-10-04', 'female', '456888654', 53, 1)," +
							"(111, 'Từ Thái Phong', '0546543554', '1990-07-14', 'male', '265468468', 54, 1)," +
							"(112, 'Trương Anh Huy', '0345686830', '1992-04-17', 'male', '006546546', 55, 1)," +
							"(113, 'Huỳnh Văn Phú', '0546515468', '1995-03-26', 'male', '655465486', 56, 1)," +
							"(114, 'Đặng Thị Liên', '0354654688', '1998-10-25', 'female', '265654688', 56, 1)," +
							"(115, 'Đỗ Đình Hậu', '0354686848', '1985-11-27', 'male', '246544898', 57, 1)," +
							"(116, 'Lê Tiến Sĩ', '0354648684', '1985-11-27', 'male', '321354644', 57, 1)," +
							"(117, 'Lê Hồng Quang', '0684989788', '1985-11-27', 'male', '654648989', 57, 1)," +
							"(118, 'Bùi Minh Tiến', '0546848798', '1985-11-27', 'male', '468486554', 57, 1)," +
							"(119, 'Vũ Xuân Việt', '0568498798', '1985-11-27', 'male', '235468888', 57, 1)," +
							"(120, 'Lê Tấn Đạt', '0546898688', '1987-07-17', 'male', '549879898', 58, 1)," +
							"(121, 'Nguyễn Như Thành', '0354654846', '1987-07-17', 'male', '856468877', 58, 1)," +
							"(122, 'Đoàn Phước Lượng', '0546548687', '1987-04-13', 'male', '484687987', 58, 1)," +
							"(123, 'Phạm Văn Lành', '0546854216', '1984-11-24', 'male', '165464877', 58, 1)," +
							"(124, 'Nguyễn Ngọc Tuấn', '0798795488', '1985-12-12', 'male', '054648888', 58, 1)," +
							"(125, 'Dương Hoài Phương', '0754545424', '1985-05-12', 'male', '165468788', 59, 1)," +
							"(126, 'Phan Vinh Bính', '0546846868', '1984-07-14', 'male', '258468888', 60, 1)," +
							"(127, 'Võ Minh Thư', '0546848688', '1987-07-14', 'female', '035354548', 61, 1)," +
							"(128, 'Phan Huỳnh Ngọc Dung', '0546848888', '1992-04-21', 'female', '998786544', 62, 1)," +
							"(129, 'Nguyễn Thế Vinh', '0321532154', '1990-06-22', 'male', '154468777', 63, 1)," +
							"(130, 'Lê Minh Vương', '0321354543', '1992-12-30', 'male', '213544687', 64, 1)," +
							"(131, 'Trương Gia Mẫn', '0354868877', '1995-01-11', 'female', '321435468', 65, 1)," +
							"(132, 'Châu Thị Kim Anh', '0478465465', '1991-04-15', 'female', '213545488', 66, 1)," +
							"(133, 'Nguyễn Minh Châu', '0654688777', '1994-10-20', 'male', '354987988', 67, 1)," +
							"(134, 'Lê Trung Kiên', '0354548987', '1991-07-13', 'male', '688798987', 68, 1)," +
							"(135, 'Phạm Hoàng Nam Trung', '0689786541', '1986-01-14', 'male', '546878888', 69, 1)," +
							"(44, 'Lê Ngọc Long', '0326664516', '1992-05-05', 'male', '233122016', 23, 1);"),



						queryInterface.bulkInsert('cancel_booking', [
							cancel_book_tour(8, 59, null, 2, 'Bận công việc đột xuất', formatDate(-7) + " 14:42:00", formatDate(-6) + " 14:42:00", formatDate(-5), 150000, formatDate(-4) + " 14:42:00", { "name": "Dương Hoài Phương", "passport": "165468788", "note": "", "helper": false }, { "name": "Dương Hoài Phương", "passport": "165468788", "note": "", "helper": false }),
							cancel_book_tour(9, 60, null, 2, 'Con bị bệnh', formatDate(-40) + " 14:42:00", formatDate(-39) + " 14:42:00", formatDate(-30), 150000, formatDate(-35) + " 14:42:00", { "name": "Phan Vinh Bính", "passport": "258468888", "note": "", "helper": false }, { "name": "Phan Vinh Bính", "passport": "258468888", "note": "", "helper": false }),
							cancel_book_tour(10, 61, null, 3, 'Đi công tác', formatDate(-39) + " 14:42:00", formatDate(-39) + " 16:42:00", formatDate(-30), 150000, formatDate(-33) + " 14:42:00", { "name": "Võ Minh Thư", "passport": "035354548", "note": "", "helper": false }, { "name": "Võ Minh Thư", "passport": "035354548", "note": "", "helper": false }),
							cancel_book_tour(11, 62, null, 3, 'Lịch công tác đột xuất', formatDate(-72) + " 15:24:00", formatDate(-72) + " 16:15:00", formatDate(-60), 800000, formatDate(-69) + " 21:42:00", { "name": "Phan Huỳnh Ngọc Dung", "passport": "998786544", "note": "", "helper": false }, { "name": "Phan Huỳnh Ngọc Dung", "passport": "998786544", "note": "", "helper": false }),
							cancel_book_tour(12, 63, null, 3, 'Bận không đi được', formatDate(-102) + " 15:24:00", formatDate(-102) + " 16:15:00", formatDate(-85), 800000, formatDate(-98) + " 21:42:00", { "name": "Nguyễn Thế Vinh", "passport": "154468777", "note": "", "helper": false }, { "name": "Nguyễn Thế Vinh", "passport": "154468777", "note": "", "helper": false }),
							cancel_book_tour(13, 64, null, 2, 'Bị Bệnh', formatDate(-139) + " 15:24:00", formatDate(-138) + " 02:21:00", formatDate(-120), 1000000, formatDate(-132) + " 21:42:00", { "name": "Lê Minh Vương", "passport": "213544687", "note": "", "helper": false }, { "name": "Lê Minh Vương", "passport": "213544687", "note": "", "helper": false }),
							cancel_book_tour(14, 65, null, 3, 'Gia đình rối ren', formatDate(-162) + " 15:24:00", formatDate(-162) + " 02:21:00", formatDate(-150), 1000000, formatDate(-161) + " 19:34:00", { "name": "Trương Gia Mẫn", "passport": "321435468", "note": "", "helper": false }, { "name": "Trương Gia Mẫn", "passport": "321435468", "note": "", "helper": false }),
							cancel_book_tour(15, 66, null, 3, 'Vấn đề sức khỏe', formatDate(-140) + " 04:12:00", formatDate(-140) + " 11:20:00", formatDate(-125), 1000000, formatDate(-138) + " 06:11:00", { "name": "Châu Thị Kim Anh", "passport": "213545488", "note": "", "helper": false }, { "name": "Châu Thị Kim Anh", "passport": "213545488", "note": "", "helper": false }),
							cancel_book_tour(16, 67, null, 2, 'Không muốn đi nữa', formatDate(-120) + " 04:12:00", formatDate(-119) + " 11:21:00", formatDate(-100), 800000, formatDate(-115) + " 14:04:00", { "name": "Nguyễn Minh Châu", "passport": "354987988", "note": "", "helper": false }, { "name": "Nguyễn Minh Châu", "passport": "354987988", "note": "", "helper": false }),
							cancel_book_tour(17, 68, null, 2, 'Hủy lịch nghỉ', formatDate(-133) + " 11:50:00", formatDate(-133) + " 15:35:00", formatDate(-120), 1000000, formatDate(-130) + " 21:43:00", { "name": "Lê Trung Kiên", "passport": "688798987", "note": "", "helper": false }, { "name": "Lê Trung Kiên", "passport": "688798987", "note": "", "helper": false }),
							cancel_book_tour(18, 69, null, 2, 'Hết tiền để đi du lịch', formatDate(-72) + " 04:12:00", formatDate(-72) + " 13:24:00", formatDate(-60), 130000, formatDate(-68) + " 22:24:00", { "name": "Phạm Hoàng Nam Trung", "passport": "546878888", "note": "", "helper": false }, { "name": "Phạm Hoàng Nam Trung", "passport": "546878888", "note": "", "helper": false }),
						])
					])
				})
			})
		});
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return Promise.all([]);
	}
};
