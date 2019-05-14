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
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Long',
            passport: '206120720',
            note: '',
            help: false
          })
        },
        { id: 3 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Sơn',
            passport: '206720245',
            note: 'Em trai thanh toán hộ',
            help: true
          })
        },
        { id: 4 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Long',
            passport: '206120720',
            note: '',
            help: false
          })
        },
        { id: 6 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Phạm Hưng Tuấn Anh',
            passport: '206124151',
            note: '',
            help: false
          })
        },
        { id: 7 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Ngọc Hải',
            passport: '311548487',
            note: 'Đã thanh toán tại quầy',
            help: false
          })
        },
        { id: 10 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Thị Phùng',
            passport: '988842154',
            note: '',
            help: false
          })
        },
        { id: 11 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Phạm Ngọc Tình',
            passport: '111321546',
            note: '',
            help: false
          })
        },
        { id: 12 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Lê Phương Mai',
            passport: '215444512',
            note: 'Người nhà lên thanh toán giùm',
            help: true
          })
        },
        { id: 14 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Lee Ngọc Hồi',
            passport: '031154877',
            note: '',
            help: false
          })
        },
        { id: 16 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Lê Văn Hải',
            passport: '211548876',
            note: '',
            help: false
          })
        },
        { id: 17 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Trần Văn Kiên',
            passport: '254549542',
            note: '',
            help: false
          })
        },
        { id: 18 }),
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
        {
          message_pay: null
        },
        { id: 3 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 4 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: 'Nguyễn Văn B thanh toán hộ'
        },
        { id: 6 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 7 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 10 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 11 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 12 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 14 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 16 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 17 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: null
        },
        { id: 18 }),
    ])
  }
};
