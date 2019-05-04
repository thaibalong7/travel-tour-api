'use strict';

// Random number from 0 to length
const randomNumber = (length) => {
	return Math.floor(Math.random() * length)
}

// Generate Pseudo Random String, if safety is important use dedicated crypto/math library for less possible collisions!
const generateCode = async (length) => {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let text = "";

	for (let i = 0; i < length; i++) {
		text += possible.charAt(randomNumber(possible.length));
	}
	return text;
}

module.exports = {
	up: async (queryInterface, Sequelize) => {
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
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: await generateCode(10) },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: await generateCode(10) },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: await generateCode(10) },
				{
					id: 5
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: await generateCode(10) },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: await generateCode(10) },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: await generateCode(10) },
				{
					id: 8
				}),
		])
	},

	down: async (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return Promise.all([
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: null },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: null },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: null },
				{
					id: 5
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: null },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: null },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code_ticket: null },
				{
					id: 8
				}),
		])
	}
};
