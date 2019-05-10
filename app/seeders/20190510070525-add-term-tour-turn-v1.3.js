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
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 1,
					payment_term: 1
				},
				{
					fk_tour: 1
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 2,
					payment_term: 1
				},
				{
					fk_tour: 2
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 5,
					payment_term: 2
				},
				{
					fk_tour: 3
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 2,
					payment_term: 1
				},
				{
					fk_tour: 4
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 5,
					payment_term: 3
				},
				{
					fk_tour: 5
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 7,
					payment_term: 5
				},
				{
					fk_tour: 6
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 40,
					payment_term: 30
				},
				{
					fk_tour: 7
				}),
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: 40,
					payment_term: 30
				},
				{
					fk_tour: 8
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
			queryInterface.bulkUpdate('tour_turns',
				{
					booking_term: null,
					payment_term: null
				},
				{
					fk_tour: {
						[Sequelize.Op.or]: [1, 2, 3, 4, 5, 6, 7, 8],
					}
				}),
		])
	}
};
