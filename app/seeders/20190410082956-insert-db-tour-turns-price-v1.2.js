'use strict';

function formatDate(days) {
	const d = new Date();
	d.setDate(d.getDate() + days)
	var month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

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
					start_date: formatDate(49),
					end_date: formatDate(54),
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
					start_date: formatDate(33),
					end_date: formatDate(37),
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
					start_date: formatDate(10),
					end_date: formatDate(15),
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
					start_date: formatDate(41),
					end_date: formatDate(49),
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
					start_date: formatDate(22),
					end_date: formatDate(30),
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
					start_date: formatDate(40),
					end_date: formatDate(48),
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
