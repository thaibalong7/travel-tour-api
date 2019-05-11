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
      queryInterface.bulkUpdate('type_passenger',
        { name_vi: 'người lớn' },
        {
          id: 1
        }),
      queryInterface.bulkUpdate('type_passenger',
        { name_vi: 'trẻ em' },
        {
          id: 2
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
    return Promise.all([
      queryInterface.bulkUpdate('type_passenger',
        { name_vi: null },
        {
          id: 1
        }),
      queryInterface.bulkUpdate('type_passenger',
        { name_vi: null },
        {
          id: 2
        }),
    ])
  }
};
