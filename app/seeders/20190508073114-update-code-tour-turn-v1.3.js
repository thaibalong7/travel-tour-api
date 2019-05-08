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
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15DEER5A' },
				{
					id: 1
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15R4S45A' },
				{
					id: 2
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15DEER15' },
				{
					id: 3
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15DEER16' },
				{
					id: 4
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15DEER4S' },
				{
					id: 5
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: 'SS4EER5A' },
				{
					id: 6
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '4SSEER5A' },
				{
					id: 7
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '5D5EE55A' },
				{
					id: 8
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '14S1DD5S' },
				{
					id: 13
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: 'SDDW55S4' },
				{
					id: 14
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15SDWF4S' },
				{
					id: 15
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '5EEF1WWW' },
				{
					id: 16
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '78SSDEF4' },
				{
					id: 17
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15SSSF8W' },
				{
					id: 18
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '15EFFG5E' },
				{
					id: 19
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '154SSSS4' },
				{
					id: 20
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: 'KGJ848F5' },
				{
					id: 21
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '330VMLFE' },
				{
					id: 33
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '154DDSLO' },
				{
					id: 34
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: 'L454H55H' },
				{
					id: 35
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: 'ITJ454GX' },
				{
					id: 36
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '155GLLSO' },
				{
					id: 37
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: 'MCLO554F' },
				{
					id: 38
				}),
			queryInterface.bulkUpdate('tour_turns',
				{ code: '1LPAN14S' },
				{
					id: 39
				}),

		])
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.
	
		  Example:
		  return queryInterface.bulkDelete('People', null, {});
		*/
		return queryInterface.bulkUpdate('tour_turns',
			{ code: null },
			{})
	}
};
