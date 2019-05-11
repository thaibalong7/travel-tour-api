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
					id: 3,
					request_message: 'Có lịch công tác đột xuất',
					fk_book_tour: 16,
					fk_user: 3,
					request_time: new Date(formatDate(-2) + ' 11:15:21'),
					confirm_time: new Date(formatDate(-1) + ' 05:16:21'),
					refund_period: formatDate(+5),
					money_refunded: 315000,
				}
			]
			)
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
					[Sequelize.Op.or]: [3],
				}
			}),
		])
	}
};
