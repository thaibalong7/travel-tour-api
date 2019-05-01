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
			queryInterface.bulkInsert('request_cancel_booking', [
				{
					id: 2,
					message: 'Bận đột xuất nên không thể đi được, mong được chấp nhận',
					fk_book_tour: 3,
					fk_user: 12,
					request_time: new Date('2019-04-22 11:15:21')
				},
			]),
			queryInterface.bulkInsert('request_cancel_booking', [
				{
					id: 1,
					message: 'Cty đang làm tổ chức Company Trip vào ngày đó, nên không thể tham gia tour được',
					fk_book_tour: 7,
					fk_user: 13,
					request_time: new Date('2019-04-28 04:07:44')
				},
			]),
			queryInterface.bulkUpdate('book_tour_contact_info',
				{ fk_user: 13 },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ status: 'paid' },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ status: 'paid' },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ status: 'pending_cancel' },
				{
					id: 3
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
			queryInterface.bulkDelete('request_cancel_booking', null, {}),
			queryInterface.bulkUpdate('book_tour_history',
				{ status: 'booked' },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ status: 'paid' },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ status: 'booked' },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('book_tour_contact_info',
				{ fk_user: null },
				{
					id: 7
				}),
		])
	}
};
