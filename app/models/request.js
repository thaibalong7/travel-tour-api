'use strict'
module.exports = (sequelize, Sequelize) => {
    var Request = sequelize.define('requests', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.TEXT,
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'requests',
            timestamps: false
        });
    return Request;
}