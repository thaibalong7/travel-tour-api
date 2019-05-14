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
        'book_tour_contact_info', // name of Source model
        'passport', // name of the key we're adding 
        {
          type: Sequelize.STRING
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
        'book_tour_contact_info', // name of Source model
        'passport', // name of the key we're remove
      ),
    ])

  }
};
