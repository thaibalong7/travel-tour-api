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
				// book_tour_contact_info belongsTo users
				'book_tour_contact_info', // name of Source model
				'fk_user', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'users', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// book_tour_history belongsTo book_tour_contact_info
				'book_tour_history', // name of Source model
				'fk_contact_info', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'book_tour_contact_info', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// book_tour_history belongsTo tour_turns
				'book_tour_history', // name of Source model
				'fk_tour_turn', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'tour_turns', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// book_tour_history belongsTo payment_method
				'book_tour_history', // name of Source model
				'fk_payment', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'payment_method', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// comments belongsTo tours
				'comments', // name of Source model
				'fk_tour', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'tours', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// comments belongsTo tours
				'comments', // name of Source model
				'fk_user', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'users', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// locations belongsTo types
				'locations', // name of Source model
				'fk_type', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'types', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
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
				'book_tour_contact_info', // name of Source model
				'fk_user' // key we want to remove
			),
			queryInterface.removeColumn(
				'book_tour_history', // name of Source model
				'fk_contact_info' // key we want to remove
			),
			queryInterface.removeColumn(
				'book_tour_history', // name of Source model
				'fk_tour_turn' // key we want to remove
			),
			queryInterface.removeColumn(
				'book_tour_history', // name of Source model
				'fk_payment' // key we want to remove
			),
			queryInterface.removeColumn(
				'comments', // name of Source model
				'fk_tour' // key we want to remove
			),
			queryInterface.removeColumn(
				'comments', // name of Source model
				'fk_user' // key we want to remove
			),
			queryInterface.removeColumn(
				'locations', // name of Source model
				'fk_type' // key we want to remove
			),
		])
	}
};
