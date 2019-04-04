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
			queryInterface.dropTable('comments'),
			queryInterface.dropTable('ratings'),
			queryInterface.createTable('reviews', { // create reviews table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
				},
				email: {
					type: Sequelize.STRING,
				},
				comment: {
					type: Sequelize.TEXT,
				},
				rate: {
					type: Sequelize.FLOAT,
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
				updatedAt: { type: Sequelize.DATE, allowNull: false },
				createdAt: { type: Sequelize.DATE, allowNull: false }
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'comments',
					timestamps: true,
					hooks: {
						beforeCreate: function (person, options, fn) {
							person.createdAt = new Date();
							person.updatedAt = new Date();
							fn(null, person);
						},
						beforeUpdate: function (person, options, fn) {
							person.updatedAt = new Date();
							fn(null, person);
						}
					}
				}),
			queryInterface.addColumn(
				'tours', //table name
				'average_rating', //column name
				{
					type: Sequelize.FLOAT,
					defaultValue: 0
				}
			)
		]);
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.dropTable('users');
		*/
		return Promise.all([
			queryInterface.createTable('comments', { // create comments table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				content: {
					type: Sequelize.TEXT,
					allowNull: false
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
				fk_user: {
					type: Sequelize.INTEGER,
					references: {
						model: 'users', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
				updatedAt: { type: Sequelize.DATE, allowNull: false },
				createdAt: { type: Sequelize.DATE, allowNull: false }
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'comments',
					timestamps: true,
					hooks: {
						beforeCreate: function (person, options, fn) {
							person.createdAt = new Date();
							person.updatedAt = new Date();
							fn(null, person);
						},
						beforeUpdate: function (person, options, fn) {
							person.updatedAt = new Date();
							fn(null, person);
						}
					}
				}),
			queryInterface.createTable('ratings', { // create ratings table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				rate: {
					type: Sequelize.INTEGER,
					allowNull: false
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
				fk_user: {
					type: Sequelize.INTEGER,
					references: {
						model: 'users', // name of Target model
						key: 'id', // key in Target model that we're referencing
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'ratings',
					timestamps: false
				}),
			queryInterface.dropTable('reviews'),
			queryInterface.removeColumn('tours', 'average_rating'),
		]);
	}
};
