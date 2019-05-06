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
				{ code: await generateCode(8) },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: await generateCode(8) },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: await generateCode(8), },
				{
					id: 5
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{
					code: await generateCode(8),
					message_pay: 'Nguyễn Văn B thanh toán hộ'
				},
				{
					id: 6
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: await generateCode(8) },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: await generateCode(8) },
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
				{ code: '78acc210-5059-11e9-aa13-03259040952a' },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: '814d77c0-5059-11e9-989c-a5f26e5408ec' },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: '870ae3a0-5059-11e9-8684-5d74946d80db' },
				{
					id: 5
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: '89216790-5059-11e9-8c7e-c3f82d1fa1ef' },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: '8fae3160-5059-11e9-98a6-11c33d1f98b4' },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('book_tour_history',
				{ code: 'a294e850-5059-11e9-8e50-6d47d5b38a8f' },
				{
					id: 8
				}),
		])
	}
};
