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

module.exports = {
	up: async (queryInterface, Sequelize) => {
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
			queryInterface.bulkInsert('tour_turns', [
				{
					id: 22,
					fk_tour: 3, //tour đà lạt - vũng tàu 3 ngày
					start_date: formatDate(-42), //1 tháng trước
					end_date: formatDate(-40),
					num_current_people: 10,
					num_max_people: 30,
					price: '700000',
					discount: 0,
					view: 117,
					status: 'public',
					code: '45SD8PN7',
					booking_term: 4,
					payment_term: 2,
					isHoliday: false
				}]).then(() => {
					return Promise.all([
						queryInterface.bulkInsert('price_passenger', [
							{
								id: 57,
								fk_tourturn: 22,
								fk_type_passenger: 1,
								percent: 100 //700,000 VND
							},
							{
								id: 58,
								fk_tourturn: 22,
								fk_type_passenger: 2,
								percent: 45 //315,000 VND
							}
						]),
						queryInterface.bulkInsert('book_tour_contact_info', [
							{
								id: 21,
								email: 'tthang@gmail.com',
								fullname: 'Trương Thanh Hằng',
								phone: '0344566421',
								address: '154 Võ Văn Tần, Quận 1, TP HCM',
								passport: '122012154',
								fk_user: null,
							},
							{
								id: 22,
								email: 'nnhung@gmail.com',
								fullname: 'Nguyễn Huy Hùng',
								phone: '0344566421',
								address: '17 Võ Văn Kiệt, Quận 1, TP HCM',
								passport: '215554986',
								fk_user: null,
							}
						])
					]).then(async () => {
						return Promise.all([
							queryInterface.bulkInsert('book_tour_history', [
								{
									id: 21,
									fk_contact_info: 21,
									fk_tour_turn: 22,
									fk_payment: 2,
									fk_staff: 3,
									message_pay: JSON.stringify({
										name: 'Trương Thanh Hằng',
										passport: '122012154',
										note: '',
										helper: true,
									}),
									book_time: formatDate(-49) + " 09:25:08",
									status: 'finished',
									num_passenger: 5,
									total_pay: 3500000, //5 người lớn,
									code: await generateCode(8),
								}
							]).then(async () => {
								return Promise.all([
									queryInterface.bulkInsert('passengers', [
										{
											id: 34,
											fk_book_tour: 21,
											fk_type_passenger: 1,
											fullname: 'Trương Thanh Hằng',
											sex: 'female',
											birthdate: '1992-01-04',
											phone: '0344566421',
										},
										{
											id: 35,
											fk_book_tour: 21,
											fk_type_passenger: 1,
											fullname: 'Trần Chí Thiện',
											sex: 'male',
											birthdate: '1998-08-14',
											phone: '0311112454',
										},
										{
											id: 36,
											fk_book_tour: 21,
											fk_type_passenger: 1,
											fullname: 'Ngô Ngọc Đăng Khoa',
											sex: 'male',
											birthdate: '1987-07-05',
											phone: '0344566548',
										},
										{
											id: 37,
											fk_book_tour: 21,
											fk_type_passenger: 1,
											fullname: 'Hồ Đường Tú',
											sex: 'female',
											birthdate: '1995-08-24',
											phone: '0335465145',
										},
										{
											id: 38,
											fk_book_tour: 21,
											fk_type_passenger: 1,
											fullname: 'Lê Trần Thanh Trang',
											sex: 'female',
											birthdate: '1997-01-04',
											phone: '0334555648',
										},
									])
								])
							}),
							queryInterface.bulkInsert('book_tour_history', [
								{
									id: 22,
									fk_contact_info: 22,
									fk_tour_turn: 22,
									fk_payment: 1,
									fk_staff: 3,
									message_pay: JSON.stringify({
										name: 'Lê Văn Hải',
										passport: '216664985',
										note: 'Thanh toán hộ',
										helper: false,
									}),
									book_time: formatDate(-62) + " 08:17:08",
									status: 'finished',
									num_passenger: 5,
									total_pay: 3115000, //4 người lớn, 1 nhỏ
									code: await generateCode(8),
								}
							]).then(() => {
								return Promise.all([
									queryInterface.bulkInsert('passengers', [
										{
											id: 39,
											fk_book_tour: 22,
											fk_type_passenger: 1,
											fullname: 'Lê Văn Hải',
											sex: 'male',
											birthdate: '1982-01-04',
											phone: '0234442157',
										},
										{
											id: 40,
											fk_book_tour: 22,
											fk_type_passenger: 1,
											fullname: 'Nguyễn Huy Hùng',
											sex: 'male',
											birthdate: '1997-08-14',
											phone: '0344566421',
										},
										{
											id: 41,
											fk_book_tour: 22,
											fk_type_passenger: 1,
											fullname: 'Trần Văn Kiêng',
											sex: 'male',
											birthdate: '1989-07-05',
											phone: '046667542',
										},
										{
											id: 42,
											fk_book_tour: 22,
											fk_type_passenger: 1,
											fullname: 'Trương Ngọc Mưu',
											sex: 'female',
											birthdate: '1990-08-01',
											phone: '0345557245',
										},
										{
											id: 43,
											fk_book_tour: 22,
											fk_type_passenger: 2,
											fullname: 'Lê Thị Ngọc',
											sex: 'female',
											birthdate: '2011-01-04',
											phone: null,
										},
									])
								])
							})
						])
					})
				}),
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
			queryInterface.bulkDelete('passengers', {
				id: {
					[Sequelize.Op.or]: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
				}
			}).then(() => {
				return queryInterface.bulkDelete('book_tour_history', {
					id: {
						[Sequelize.Op.or]: [21, 22],
					}
				}).then(() => {
					return queryInterface.bulkDelete('book_tour_contact_info', {
						id: {
							[Sequelize.Op.or]: [21, 22],
						}
					}).then(() => {
						return queryInterface.bulkDelete('price_passenger', {
							id: {
								[Sequelize.Op.or]: [57, 58],
							}
						}).then(() => {
							return queryInterface.bulkDelete('tour_turns', {
								id: {
									[Sequelize.Op.or]: [22],
								}
							})
						})
					})
				})
			}),
		]);
	}
};
