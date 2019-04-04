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
				// routes belongsTo tours
				'routes', // name of Source model
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
				// routes belongsTo locations
				'routes', // name of Source model
				'fk_location', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'locations', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// routes belongsTo transports
				'routes', // name of Source model
				'fk_transport', // name of the key we're adding 
				{
					type: Sequelize.INTEGER,
					references: {
						model: 'transports', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				}
			),
			queryInterface.addColumn(
				// verification_token belongsTo users
				'verification_token', // name of Source model
				'user_id', // name of the key we're adding 
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
				// tour_images belongsTo tours
				'tour_images', // name of Source model
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
				// tour_turns belongsTo tours
				'tour_turns', // name of Source model
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
				'routes', // name of Source model
				'fk_tour' // key we want to remove
			),
			queryInterface.removeColumn(
				'routes', // name of Source model
				'fk_location' // key we want to remove
			),
			queryInterface.removeColumn(
				'routes', // name of Source model
				'fk_transport' // key we want to remove
			),
			queryInterface.removeColumn(
				'verification_token', // name of Source model
				'user_id' // key we want to remove
			),
			queryInterface.removeColumn(
				'tour_images', // name of Source model
				'fk_tour' // key we want to remove
			),
			queryInterface.removeColumn(
				'tour_turns', // name of Source model
				'fk_tour' // key we want to remove
			)
		])
	}
};
