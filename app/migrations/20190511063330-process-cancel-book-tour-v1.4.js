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
			queryInterface.dropTable('request_cancel_booking'),
			queryInterface.createTable('cancel_booking', { // create cancel_booking table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				request_message: {
					type: Sequelize.TEXT,
				},
				request_time: {
					type: Sequelize.DATE,
					defaultValue: Sequelize.fn('NOW')
				},
				confirm_time: {
					type: Sequelize.DATE,
				},
				refund_period: {
					type: Sequelize.DATEONLY,
				},
				refund_message: {
					type: Sequelize.TEXT,
				},
				money_refunded: {
					type: Sequelize.INTEGER,
					defaultValue: 0
				},
				refunded_time: {
					type: Sequelize.DATE
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'cancel_booking',
					timestamps: false
				}).then(() => {
					return Promise.all([queryInterface.addColumn(
						// request_cancel_booking belongsTo book_tour_history
						'cancel_booking', // name of Source model
						'fk_book_tour', // name of the key we're adding 
						{
							type: Sequelize.INTEGER,
							references: {
								model: 'book_tour_history', // name of Target model
								key: 'id', // key in Target model that we're referencing
							},
							onUpdate: 'CASCADE',
							onDelete: 'SET NULL',
						}
					),
					queryInterface.addColumn(
						// request_cancel_booking belongsTo users
						'cancel_booking', // name of Source model
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
					)
					])
				}),
			queryInterface.changeColumn('book_tour_history', 'status',
				{
					type: Sequelize.ENUM('booked', 'paid', 'cancelled', 'pending_cancel', 'confirm_cancel', 'refunded', 'not_refunded', 'finished'),
					defaultValue: 'booked'
				}
			)
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
			queryInterface.createTable('request_cancel_booking', { //10. create request_cancel_booking table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				// status: {
				// 	type: Sequelize.ENUM('pending', 'solved'),
				// 	defaultValue: 'pending'
				// },
				message: {
					type: Sequelize.TEXT,
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'request_cancel_booking',
					timestamps: false
				}),
			queryInterface.dropTable('cancel_booking'),
			queryInterface.changeColumn('book_tour_history', 'status',
				{
					type: Sequelize.ENUM('booked', 'paid', 'cancelled', 'pending_cancel', 'finished'),
					defaultValue: 'booked'
				}
			)
		])
	}
};
