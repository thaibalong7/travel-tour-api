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
            queryInterface.addColumn(
                // reviews belongsTo users
				'reviews', // name of Source model
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
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
        return Promise.all([
            queryInterface.removeColumn(
				'reviews', // name of Source model
				'fk_user' // key we want to remove
			)
        ])
    }
};
