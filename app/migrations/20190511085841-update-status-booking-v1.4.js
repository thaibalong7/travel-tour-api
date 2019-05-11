'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.createTable('users', { id: Sequelize.INTEGER });
		*/
		return queryInterface.changeColumn('book_tour_history', 'status',
			{
				type: Sequelize.ENUM('booked', 'paid', 'cancelled', 'pending_cancel', 'confirm_cancel', 'refunded', 'not_refunded', 'finished'),
				defaultValue: 'booked'
			}
		)
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.dropTable('users');
		*/
		return queryInterface.changeColumn('book_tour_history', 'status',
			{
				type: Sequelize.ENUM('booked', 'paid', 'cancelled', 'pending_cancel', 'finished'),
				defaultValue: 'booked'
			}
		)
	}
};
