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
			queryInterface.createTable('roles_admin', { //8. create payment_method table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
				}).then(() => {
					return Promise.all([
						queryInterface.addColumn(
							// admin belongsTo role_admin
							'admins', // name of Source model
							'fk_role', // name of the key we're adding 
							{
								type: Sequelize.INTEGER,
								references: {
									model: 'roles_admin', // name of Target model
									key: 'id', // key in Target model that we're referencing
								},
								onUpdate: 'CASCADE',
								onDelete: 'SET NULL',
							}
						),
						queryInterface.addColumn(
							// admin belongsTo role_admin
							'book_tour_history', // name of Source model
							'fk_staff', // name of the key we're adding 
							{
								type: Sequelize.INTEGER,
								references: {
									model: 'admins', // name of Target model
									key: 'id', // key in Target model that we're referencing
								},
								onUpdate: 'CASCADE',
								onDelete: 'SET NULL',
							}
						),
						queryInterface.addColumn(
							// admin belongsTo role_admin
							'cancel_booking', // name of Source model
							'fk_staff', // name of the key we're adding 
							{
								type: Sequelize.INTEGER,
								references: {
									model: 'admins', // name of Target model
									key: 'id', // key in Target model that we're referencing
								},
								onUpdate: 'CASCADE',
								onDelete: 'SET NULL',
							}
						),
					])
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
		return queryInterface.removeColumn(
			'admins', // name of Source model
			'fk_role' // key we want to remove
		).then(() => {
			return Promise.all([
				queryInterface.dropTable('roles_admin'),
				queryInterface.removeColumn(
					'book_tour_history', // name of Source model
					'fk_staff' // key we want to remove
				),
				queryInterface.removeColumn(
					'cancel_booking', // name of Source model
					'fk_staff' // key we want to remove
				),
			])
		});
	}
};
