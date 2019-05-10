'use strict'
module.exports = (sequelize, Sequelize) => {
    var Passenger = sequelize.define('passengers', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        birthdate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        sex: {
            type: Sequelize.ENUM('male', 'female', 'other'),
            allowNull: true
        },
        passport: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'passengers',
            timestamps: false
        });
        Passenger.associate = (models) => {
            Passenger.belongsTo(models.book_tour_history, {foreignKey: 'fk_book_tour'})
            Passenger.belongsTo(models.type_passenger, {foreignKey: 'fk_type_passenger'})
          }
    return Passenger;
}