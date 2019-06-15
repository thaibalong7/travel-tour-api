'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkInsert('People', [{
			name: 'John Doe',
			isBetaMember: false
		  }], {});
		*/
		return Promise.all([
			queryInterface.bulkInsert('roles_admin', [
				{
					id: 1,
					name: 'Quản lý'
				},
				{
					id: 2,
					name: 'Nhân viên'
				}
			]).then(() => {
				return Promise.all([
					queryInterface.bulkUpdate('admins',
						{
							fk_role: 1,
							birthdate: '2019-01-01',
							password: bcrypt.hashSync('01012019', null, null).toString(),
						}, //update //admins
						{ //where
							id: 1
						}),
					queryInterface.bulkUpdate('admins',
						{
							fk_role: 1,
							birthdate: '1997-01-01',
							password: bcrypt.hashSync('01011997', null, null).toString(),
						}, //update //nnlinh
						{ //where
							id: 2
						}),
					queryInterface.bulkInsert('admins', [
						{
							id: '3',
							username: 'tblong',
							name: 'Thái Bá Long',
							password: bcrypt.hashSync('2404111997', null, null).toString(),
							birthdate: '1997-11-24',
							fk_role: 2
						}
					]),
					queryInterface.bulkInsert('admins', [
						{
							id: '5',
							username: 'ltb',
							name: 'Lê Thanh Bình',
							password: bcrypt.hashSync('01011993', null, null).toString(),
							birthdate: '1993-01-01',
							fk_role: 2
						}
					]),
					queryInterface.bulkInsert('admins', [
						{
							id: '4',
							username: 'bot',
							name: 'Bot Server',
							password: bcrypt.hashSync('01012019', null, null).toString(),
							fk_role: 2,
							birthdate: '2019-01-01',
						},
					]).then(() => {
						return queryInterface.bulkUpdate('book_tour_history',
							{ fk_staff: 4 }, //update //bot
							{ //where
								status: {
									[Sequelize.Op.or]: ['paid', 'pending_cancel', 'confirm_cancel', 'refunded', 'not_refunded'],
								},
								fk_payment: {
									[Sequelize.Op.or]: [3] //ngoại trừ online
								}
							});
					}),
					queryInterface.bulkUpdate('book_tour_history',
						{ fk_staff: 2 }, //update //nnlinh
						{ //where
							status: {
								[Sequelize.Op.or]: ['paid', 'pending_cancel', 'confirm_cancel', 'refunded', 'not_refunded'],
							},
							fk_payment: {
								[Sequelize.Op.or]: [1, 2] //ngoại trừ online
							}
						}),
					queryInterface.bulkUpdate('cancel_booking',
						{ fk_staff: 3 }, //update //tblong
						{ //where
							money_refunded: {
								[Sequelize.Op.gt]: 0,
							},
							refunded_time: {
								[Sequelize.Op.ne]: null
							}
						}),
				])
			})
		])
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return Promise.all([
			queryInterface.bulkUpdate('book_tour_history',
				{ fk_staff: null }, //update //nnlinh
				{
				}),
			queryInterface.bulkUpdate('cancel_booking',
				{ fk_staff: null }, //update //nnlinh
				{
				}),

		]).then(() => {
			return queryInterface.bulkDelete('roles_admin', null, {})
		});
	}
};
