'use strict'
module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define('users', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING
        },
        fullname: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        sex: {
            type: Sequelize.ENUM('male', 'female', 'other'),
            allowNull: true
        },
        birthdate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        avatar: {
            type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        type: {
            type: Sequelize.ENUM('facebook', 'local')
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'users',
            timestamps: false
        });
    return User;
}