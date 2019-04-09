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
            queryInterface.createTable('type_tour', { // create type_tour table
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING,
                },
            },
                {
                    charset: 'utf8',
                    collate: 'utf8_unicode_ci',
                }),
            queryInterface.createTable('countries', { // create nation table //bảng gồm các quốc gia
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING,
                },
            },
                {
                    charset: 'utf8',
                    collate: 'utf8_unicode_ci',
                }),
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
            queryInterface.dropTable('countries'),
            queryInterface.dropTable('type_tour'),
        ])
    }
};
