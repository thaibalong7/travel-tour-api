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
            helper: false
          })
        },
        { id: 3 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Sơn',
            passport: '206720245',
            note: 'Em trai thanh toán hộ',
            helper: true
          })
        },
        { id: 4 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Thái Bá Long',
            passport: '206120720',
            note: '',
            helper: false
          })
        },
        { id: 6 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Phạm Hưng Tuấn Anh',
            passport: '206124151',
            note: '',
            helper: false
          })
        },
        { id: 7 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Ngọc Hải',
            passport: '311548487',
            note: 'Đã thanh toán tại quầy',
            helper: false
          })
        },
        { id: 10 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Thị Phùng',
            passport: '988842154',
            note: '',
            helper: false
          })
        },
        { id: 11 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Phạm Ngọc Tình',
            passport: '111321546',
            note: '',
            helper: false
          })
        },
        { id: 12 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Lê Phương Mai',
            passport: '215444512',
            note: 'Người nhà lên thanh toán giùm',
            helper: true
          })
        },
        { id: 14 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Lee Ngọc Hồi',
            passport: '031154877',
            note: '',
            helper: false
          })
        },
        { id: 16 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Lê Văn Hải',
            passport: '211548876',
            note: '',
            helper: false
          })
        },
        { id: 17 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Trần Văn Kiên',
            passport: '254549542',
            note: '',
            helper: false
          })
        },
        { id: 18 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Nguyễn Trần Trung Kiên',
            passport: '206664551',
            note: '',
            helper: false
          })
        },
        { id: 19 }),
      queryInterface.bulkUpdate('book_tour_history',
        {
          message_pay: JSON.stringify({
            name: 'Võ Văn Thanh',
            passport: '322154460',
            note: '',
            helper: false
          })
        },
        { id: 20 }),
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
        {
          id: {
            [Sequelize.Op.or]: [3, 4, 6, 7, 10, 11, 12, 14, 16, 17, 18, 19, 20],
          }
        })
    ])
  }
};
