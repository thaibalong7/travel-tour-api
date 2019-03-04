'use strict'
module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define('users', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sex: {
            type: Sequelize.ENUM('male', 'female', 'other'),
            allowNull: true
        },
        birthdate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        avatar: {
            type: Sequelize.STRING
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