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
			queryInterface.bulkUpdate('tours',
				{ num_days: 1 },
				{
					id: 1
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 1 },
				{
					id: 2
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 3 },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 1 },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 6 },
				{
					id: 5
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 10 },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 8 },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('tours',
				{ num_days: 6 },
				{
					id: 8
				}),
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
			queryInterface.bulkUpdate('tours',
				{ num_days: null },
				null),
		]);
	}
};
