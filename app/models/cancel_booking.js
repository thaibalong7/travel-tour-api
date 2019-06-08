'use strict'
module.exports = (sequelize, Sequelize) => {
    var CancelTourBooking = sequelize.define('cancel_booking', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        request_message: {
            type: Sequelize.TEXT,
        },
        request_time: {
            type: Sequelize.DATE,
        },
        confirm_time: {
            type: Sequelize.DATE,
        },
        refund_period: {
            type: Sequelize.DATEONLY,
        },
        refund_message: {
            type: Sequelize.TEXT,
        },
        money_refunded: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        refunded_time: {
            type: Sequelize.DATE
        },
        request_offline_person: {
            type: Sequelize.TEXT,
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'cancel_booking',
            timestamps: false
        });

    CancelTourBooking.associate = (models) => {
        CancelTourBooking.belongsTo(models.book_tour_history, { foreignKey: 'fk_book_tour' })
        CancelTourBooking.belongsTo(models.users, { foreignKey: 'fk_user' })
        CancelTourBooking.belongsTo(models.admins, { foreignKey: 'fk_staff' })
    }

    return CancelTourBooking;
}