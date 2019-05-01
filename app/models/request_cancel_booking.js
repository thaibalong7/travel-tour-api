'use strict'
module.exports = (sequelize, Sequelize) => {
    var RequestCancelTourBooking = sequelize.define('request_cancel_booking', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.ENUM('pending', 'solved'),
            defaultValue: 'pending'
        },
        message: {
            type: Sequelize.TEXT,
        },
        request_time: {
            type: Sequelize.DATE,
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'request_cancel_booking',
            timestamps: false
        });

    RequestCancelTourBooking.associate = (models) => {
        RequestCancelTourBooking.belongsTo(models.book_tour_history, { foreignKey: 'fk_book_tour' })
        RequestCancelTourBooking.belongsTo(models.users, { foreignKey: 'fk_user' })
    }

    return RequestCancelTourBooking;
}