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
      queryInterface.bulkUpdate('book_tour_history',
        { id: 3 },
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Long',
            passport: '206120720',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 4 },
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Sơn',
            passport: '206720245',
            note: 'Em trai thanh toán hộ',
            help: true
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 6 },
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Long',
            passport: '206120720',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 7 },
        {
          message_pay: JSON.stringify({
            name: 'Phạm Hưng Tuấn Anh',
            passport: '206124151',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 10 },
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Ngọc Hải',
            passport: '311548487',
            note: 'Đã thanh toán tại quầy',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 11 },
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Thị Phùng',
            passport: '988842154',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 12 },
        {
          message_pay: JSON.stringify({
            name: 'Phạm Ngọc Tình',
            passport: '111321546',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 14 },
        {
          message_pay: JSON.stringify({
            name: 'Lê Phương Mai',
            passport: '215444512',
            note: 'Người nhà lên thanh toán giùm',
            help: true
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 16 },
        {
          message_pay: JSON.stringify({
            name: 'Lee Ngọc Hồi',
            passport: '031154877',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 17 },
        {
          message_pay: JSON.stringify({
            name: 'Lê Văn Hải',
            passport: '211548876',
            note: '',
            help: false
          })
        }),
      queryInterface.bulkUpdate('book_tour_history',
        { id: 18 },
        {
          message_pay: JSON.stringify({
            name: 'Trần Văn Kiên',
            passport: '254549542',
            note: '',
            help: false
          })
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
      queryInterface.bulkUpdate('book_tour_history',
      { id: 3 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 4 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 6 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 7 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 10 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 11 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 12 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 14 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 16 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 17 },
      {
        message_pay: null
      }),
    queryInterface.bulkUpdate('book_tour_history',
      { id: 18 },
      {
        message_pay: null
      }),
    ])
  }
};
