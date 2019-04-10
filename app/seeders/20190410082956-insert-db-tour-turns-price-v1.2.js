'use strict';

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
			queryInterface.bulkInsert('tour_turns', [
				{
					id: 34,
					start_date: '2019-04-19',
					end_date: '2019-04-24',
					num_current_people: 0,
					num_max_people: 30,
					price: 18000000,
					discount: 0,
					view: 0,
					status: 'public',
					fk_tour: 8
				},
				{
					id: 35,
					start_date: '2019-04-28',
					end_date: '2019-05-03',
					num_current_people: 0,
					num_max_people: 30,
					price: 17000000,
					discount: 0,
					view: 0,
					status: 'public',
					fk_tour: 8
				},
				{
					id: 36,
					start_date: '2019-05-20',
					end_date: '2019-05-25',
					num_current_people: 0,
					num_max_people: 30,
					price: 18000000,
					discount: 5,
					view: 0,
					status: 'public',
					fk_tour: 8
				}
			]),
			queryInterface.bulkInsert('tour_turns', [
				{
					id: 37,
					start_date: '2019-05-01',
					end_date: '2019-05-09',
					num_current_people: 0,
					num_max_people: 35,
					price: 32000000,
					discount: 10,
					view: 0,
					status: 'public',
					fk_tour: 7
				},
				{
					id: 38,
					start_date: '2019-05-25',
					end_date: '2019-06-03',
					num_current_people: 0,
					num_max_people: 40,
					price: 34000000,
					discount: 0,
					view: 0,
					status: 'public',
					fk_tour: 7
				},
				{
					id: 39,
					start_date: '2019-05-20',
					end_date: '2019-05-29',
					num_current_people: 0,
					num_max_people: 35,
					price: 33500000,
					discount: 0,
					view: 0,
					status: 'public',
					fk_tour: 7
				}
			])
		]).then(() => {
			return Promise.all([
				queryInterface.bulkInsert('price_passenger', [
					{
						id: 41,
						percent: 100,
						fk_tourturn: 34,
						fk_type_passenger: 1
					},
					{
						id: 42,
						percent: 49,
						fk_tourturn: 34,
						fk_type_passenger: 2
					},
					{
						id: 43,
						percent: 100,
						fk_tourturn: 35,
						fk_type_passenger: 1
					},
					{
						id: 44,
						percent: 50,
						fk_tourturn: 35,
						fk_type_passenger: 2
					},
					{
						id: 45,
						percent: 100,
						fk_tourturn: 36,
						fk_type_passenger: 1
					},
					{
						id: 46,
						percent: 50,
						fk_tourturn: 36,
						fk_type_passenger: 2
					},
					{
						id: 47,
						percent: 100,
						fk_tourturn: 37,
						fk_type_passenger: 1
					},
					{
						id: 48,
						percent: 55,
						fk_tourturn: 37,
						fk_type_passenger: 2
					},
					{
						id: 49,
						percent: 100,
						fk_tourturn: 38,
						fk_type_passenger: 1
					},
					{
						id: 50,
						percent: 50,
						fk_tourturn: 38,
						fk_type_passenger: 2
					},
					{
						id: 51,
						percent: 100,
						fk_tourturn: 39,
						fk_type_passenger: 1
					},
					{
						id: 52,
						percent: 45,
						fk_tourturn: 39,
						fk_type_passenger: 2
					},
				]),
			])
		})
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return Promise.all([
			queryInterface.bulkDelete('price_passenger', {
				fk_tourturn: {
					[Sequelize.Op.or]: [34, 35, 36, 37, 38, 39],
				}
			}).then(() => {
				return queryInterface.bulkDelete('tour_turns', {
					id: {
						[Sequelize.Op.or]: [34, 35, 36, 37, 38, 39],
					}
				})
			})
		])
	}
};
