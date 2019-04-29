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
			queryInterface.changeColumn('locations', 'latitude', {
				type: Sequelize.DECIMAL(10, 8),
				allowNull: false
			}),
			queryInterface.changeColumn('locations', 'longitude', {
				type: Sequelize.DECIMAL(11, 8),
				allowNull: false
			}),
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
			queryInterface.changeColumn('locations', 'latitude', {
				type: Sequelize.FLOAT(10, 6),
				allowNull: false
			}),
			queryInterface.changeColumn('locations', 'longitude', {
				type: Sequelize.FLOAT(10, 6),
				allowNull: false
			}),
		])
	}
};
