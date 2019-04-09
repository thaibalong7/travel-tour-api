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
			queryInterface.createTable('provinces', { // create reviews table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
				},
				fk_country: {
					type: Sequelize.INTEGER,
					references: {
						model: 'countries', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
				}),
			queryInterface.createTable('tour_countries', { // create reviews table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				fk_tour: {
					type: Sequelize.INTEGER,
					references: {
						model: 'tours', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
				fk_country: {
					type: Sequelize.INTEGER,
					references: {
						model: 'countries', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
				}),
			queryInterface.createTable('tour_provinces', { // create reviews table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				fk_tour: {
					type: Sequelize.INTEGER,
					references: {
						model: 'tours', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
				fk_province: {
					type: Sequelize.INTEGER,
					references: {
						model: 'provinces', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
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
			queryInterface.dropTable('tour_countries'),
			queryInterface.dropTable('tour_provinces'),
			queryInterface.dropTable('provinces'),
		])
	}
};
