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
            queryInterface.bulkUpdate('locations',
                { fk_province: 79 }, //Hồ Chí Minh
                {
                    id: {
                        [Sequelize.Op.or]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                            19, 21, 22, 23, 24, 25, 26, 27, 28, 30, 56, 57, 59, 91]
                    }
                }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 74 }, //Bình Dương
                { id: { [Sequelize.Op.or]: [20] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 77 }, //Bà Rịa - Vũng Tàu
                { id: { [Sequelize.Op.or]: [51, 52, 53, 54, 55] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 68 }, //Lâm Đồng
                { id: { [Sequelize.Op.or]: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 60 }, //Bình Thuận
                { id: { [Sequelize.Op.or]: [60, 61] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 56 }, //Khánh Hòa
                { id: { [Sequelize.Op.or]: [44, 45, 46, 47, 62, 80, 81, 82] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 49 }, //Quảng Nam
                { id: { [Sequelize.Op.or]: [50, 65] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 48 }, //Đà Nẵng
                { id: { [Sequelize.Op.or]: [48, 49, 58, 63, 64, 83, 84] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 46 }, //Thừa Thiên - Huế
                { id: { [Sequelize.Op.or]: [66, 86, 87] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 45 }, //Quảng Trị
                { id: { [Sequelize.Op.or]: [85] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 44 }, //Quảng Bình
                { id: { [Sequelize.Op.or]: [67] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 1 }, //Hà Nội
                { id: { [Sequelize.Op.or]: [68, 72, 88, 90] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 37 }, //Ninh Bình
                { id: { [Sequelize.Op.or]: [69] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 22 }, //Quảng Ninh
                { id: { [Sequelize.Op.or]: [70, 71, 89] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 10 }, //Lào Cai
                { id: { [Sequelize.Op.or]: [73, 74, 75, 76] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 97 }, //Istanbul
                { id: { [Sequelize.Op.or]: [92, 105, 107, 108, 109] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 98 }, //Çanakkale
                { id: { [Sequelize.Op.or]: [93] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 99 }, //İzmir
                { id: { [Sequelize.Op.or]: [95, 96] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 100 }, //Denizli
                { id: { [Sequelize.Op.or]: [94, 97, 98, 99] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 101 }, //Nevşehir
                { id: { [Sequelize.Op.or]: [102, 103, 104] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 102 }, //Aydın
                { id: { [Sequelize.Op.or]: [106] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 103 }, //Konya
                { id: { [Sequelize.Op.or]: [100] } }),
            queryInterface.bulkUpdate('locations',
                { fk_province: 104 }, //Aksaray
                { id: { [Sequelize.Op.or]: [101] } }),
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
            queryInterface.bulkUpdate('locations', { fk_province: null }, {}),
        ])
    }
};
