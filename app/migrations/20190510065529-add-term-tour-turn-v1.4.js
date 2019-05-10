'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.createTable('users', { id: Sequelize.INTEGER });
		*/
		return Promise.all([
			queryInterface.addColumn(
				'tour_turns', // name of Source model
				'booking_term', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
				}
			),
			queryInterface.addColumn(
				'tour_turns', // name of Source model
				'payment_term', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
				}
			),
		])
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.dropTable('users');
		*/
		return Promise.all([
			queryInterface.removeColumn(
				'tour_turns', // name of Source model
				'booking_term', // name of the key we're remove
			),
			queryInterface.removeColumn(
				'tour_turns', // name of Source model
				'payment_term', // name of the key we're remove
			),
		])
	}
};
