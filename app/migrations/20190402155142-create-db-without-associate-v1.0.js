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
			queryInterface.createTable('users', {  //1. create users table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				username: {
					type: Sequelize.STRING
				},
				fullname: {
					type: Sequelize.STRING,
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				},
				address: {
					type: Sequelize.TEXT,
					allowNull: true,
				},
				sex: {
					type: Sequelize.ENUM('male', 'female', 'other'),
					allowNull: true
				},
				birthdate: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				phone: {
					type: Sequelize.STRING,
				},
				email: {
					type: Sequelize.STRING,
				},
				avatar: {
					type: Sequelize.STRING
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				type: {
					type: Sequelize.ENUM('facebook', 'local')
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'users',
					timestamps: false
				}),
			queryInterface.createTable('admins', { //2. create admins table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				username: {
					type: Sequelize.STRING,
					allowNull: false
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'admins',
					timestamps: false
				}),
			queryInterface.createTable('blacklist_tokens', { //3. create blacklist_tokens table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				token: {
					type: Sequelize.TEXT
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'blacklist_tokens',
					timestamps: false
				}),
			queryInterface.createTable('book_tour_contact_info', { //4. create book_tour_contact_info table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				email: {
					type: Sequelize.STRING,
				},
				fullname: {
					type: Sequelize.STRING,
				},
				phone: {
					type: Sequelize.STRING,
				},
				address: {
					type: Sequelize.TEXT,
					allowNull: true,
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'book_tour_contact_info',
					timestamps: false
				}),
			queryInterface.createTable('book_tour_history', { //5. create book_tour_history table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				book_time: {
					type: Sequelize.DATE,
					allowNull: false,
				},
				status: {
					type: Sequelize.ENUM('booked', 'paid', 'cancelled'),
					defaultValue: 'booked'
				},
				num_passenger: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0
				},
				total_pay: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0
				},
				code: {
					type: Sequelize.TEXT,
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'book_tour_history',
					timestamps: false
				}),
			queryInterface.createTable('locations', { //6. create locations table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				latitude: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				longitude: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
					unique: true
				},
				address: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				description: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				featured_img: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				status: {
					type: Sequelize.ENUM('active', 'inactive'),
					defaultValue: 'active'
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'locations',
					timestamps: false
				}),
			queryInterface.createTable('passengers', { //7. create pasengers table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				fullname: {
					type: Sequelize.STRING,
					allowNull: false
				},
				phone: {
					type: Sequelize.STRING,
					allowNull: true
				},
				birthdate: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				sex: {
					type: Sequelize.ENUM('male', 'female', 'other'),
					allowNull: true
				},
				passport: {
					type: Sequelize.STRING,
					allowNull: true
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'passengers',
					timestamps: false
				}),
			queryInterface.createTable('payment_method', { //8. create payment_method table
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
					tableName: 'payment_method',
					timestamps: false
				}),
			queryInterface.createTable('price_passenger', { //9. create price_passenger table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				percent: {
					type: Sequelize.INTEGER,
					defaultValue: 100
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'price_passenger',
					timestamps: false
				}),
			queryInterface.createTable('request_cancel_booking', { //10. create request_cancel_booking table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				status: {
					type: Sequelize.ENUM('pending', 'solved'),
					defaultValue: 'pending'
				},
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
			queryInterface.createTable('requests', { //11. create requests table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING
				},
				email: {
					type: Sequelize.STRING,
				},
				message: {
					type: Sequelize.TEXT,
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'requests',
					timestamps: false
				}),
			queryInterface.createTable('routes', { //12. create routes table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				arrive_time: {
					type: Sequelize.TIME,
				},
				leave_time: {
					type: Sequelize.TIME,
				},
				day: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				detail: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				title: {
					type: Sequelize.TEXT,
					allowNull: true
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'routes',
					timestamps: false
				}),
			queryInterface.createTable('verification_token', { //13. create verification_token table
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				token: {
					type: Sequelize.STRING,
					allowNull: false
				},
				updatedAt: { type: Sequelize.DATE, allowNull: false },
				createdAt: { type: Sequelize.DATE, allowNull: false }
			}, {
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'verification_token',
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
			queryInterface.createTable('tour_images', { //14. create tour_images table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.TEXT,
					allowNull: false
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'tour_images',
					timestamps: false
				}),
			queryInterface.createTable('tour_turns', { //15. create tour_turns table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				start_date: {
					type: Sequelize.DATEONLY,
					allowNull: false,
				},
				end_date: {
					type: Sequelize.DATEONLY,
					allowNull: false,
				},
				num_current_people: {
					type: Sequelize.INTEGER,
					defaultValue: 0
				},
				num_max_people: {
					type: Sequelize.INTEGER,
					allowNull: false,
				},
				price: {
					type: Sequelize.INTEGER,
					defaultValue: 0
				},
				discount: {
					type: Sequelize.INTEGER,
					defaultValue: 0
				},
				view: {
					type: Sequelize.INTEGER,
					defaultValue: 0
				},
				status: {
					type: Sequelize.ENUM('public', 'private')
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'tour_turns',
					timestamps: false
				}),
			queryInterface.createTable('tours', { //16. create tours table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				description: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				detail: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				featured_img: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				policy: {
					type: Sequelize.TEXT,
					allowNull: true
				}
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'tours',
					timestamps: false
				}),
			queryInterface.createTable('transports', { //17. create transports table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name_vn: {
					type: Sequelize.STRING,
					allowNull: false
				},
				name_en: {
					type: Sequelize.STRING,
					allowNull: false
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'transports',
					timestamps: false
				}),
			queryInterface.createTable('type_passenger', { //18. create type_passenger table
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
					tableName: 'type_passenger',
					timestamps: false
				}),
			queryInterface.createTable('types', { //19. create types table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				marker: {
					type: Sequelize.TEXT,
					allowNull: true
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'types',
					timestamps: false
				}),
			queryInterface.createTable('comments', { //20. create comments table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				content: {
					type: Sequelize.TEXT,
					allowNull: false
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
			queryInterface.createTable('ratings', { //21. create ratings table
				id: {
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				rate: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
			},
				{
					charset: 'utf8',
					collate: 'utf8_unicode_ci',
					tableName: 'ratings',
					timestamps: false
				})
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
			queryInterface.dropTable('users'),
			queryInterface.dropTable('admins'),
			queryInterface.dropTable('blacklist_tokens'),
			queryInterface.dropTable('book_tour_contact_info'),
			queryInterface.dropTable('book_tour_history'),
			queryInterface.dropTable('locations'),
			queryInterface.dropTable('passengers'),
			queryInterface.dropTable('payment_method'),
			queryInterface.dropTable('price_passenger'),
			queryInterface.dropTable('request_cancel_booking'),
			queryInterface.dropTable('requests'),
			queryInterface.dropTable('routes'),
			queryInterface.dropTable('verification_token'),
			queryInterface.dropTable('tour_images'),
			queryInterface.dropTable('tour_turns'),
			queryInterface.dropTable('tours'),
			queryInterface.dropTable('transports'),
			queryInterface.dropTable('type_passenger'),
			queryInterface.dropTable('types'),
			queryInterface.dropTable('comments'),
			queryInterface.dropTable('ratings'),
		])
	}
};
