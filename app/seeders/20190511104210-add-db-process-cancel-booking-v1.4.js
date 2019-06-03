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
			queryInterface.bulkInsert('cancel_booking', [
				{
					id: 4,
					request_message: 'Có lịch công tác đột xuất',
					fk_book_tour: 16,
					fk_user: 3,
					request_time: new Date(formatDate(-2) + ' 11:15:21'),
					confirm_time: new Date(formatDate(-1) + ' 05:16:21'),
					refund_period: formatDate(+5),
					money_refunded: 200000,
					refund_message: JSON.stringify({
						name: 'Lê Trần Bảo Lâm',
						passport: '315444658',
						helper: true,
						note: 'nothing to note'
					})
				}
			]
			),
			queryInterface.bulkInsert('cancel_booking', [
				{
					id: 5,
					request_message: 'Mắc thi cuối kỳ',
					fk_book_tour: 17,
					fk_user: 9,
					request_time: new Date(formatDate(-15) + ' 17:34:11'),
					confirm_time: new Date(formatDate(-14) + ' 04:41:37'),
					refund_period: formatDate(-8),
					money_refunded: 2500000,
				}
			]
			),
			queryInterface.bulkInsert('cancel_booking', [
				{
					id: 6,
					request_message: 'Cty có lịch công tác đột xuất ở nước ngoài',
					fk_book_tour: 18,
					fk_user: null,
					request_time: new Date(formatDate(-8) + ' 12:04:00'),
					confirm_time: new Date(formatDate(-8) + ' 12:05:00'),
					refunded_time: new Date(formatDate(-8) + ' 12:05:00'),
					money_refunded: 2910000,
					request_offline_person: JSON.stringify({
						name: 'Lê Thị Thanh Thảo',
						passport: '215454687',
						helper: true,
						note: 'Có người yêu cầu hộ'
					}),
				}
			]
			),
			queryInterface.bulkInsert('cancel_booking', [
				{
					id: 7,
					request_message: 'Bị bệnh không thể đi được',
					fk_book_tour: 20,
					fk_user: null,
					request_time: new Date(formatDate(-11) + ' 12:04:00'),
					confirm_time: new Date(formatDate(-11) + ' 12:04:00'),
					money_refunded: 0,
					request_offline_person: JSON.stringify({
						name: 'Trần Lê Phương Mai',
						passport: '215545621',
						helper: true,
						note: 'Người yêu cầu hộ'
					})
				}
			])
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
			queryInterface.bulkDelete('cancel_booking', {
				id: {
					[Sequelize.Op.or]: [4, 5, 6, 7],
				}
			}),
		])
	}
};
