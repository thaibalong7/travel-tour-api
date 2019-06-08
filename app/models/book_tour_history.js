module.exports = function (sequelize, Sequelize) {
    var Book_Tour_History = sequelize.define('book_tour_history', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        book_time: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('booked', 'paid', 'cancelled', 'pending_cancel', 'confirm_cancel', 'refunded', 'not_refunded', 'finished'),
            defaultValue: 'booked'
        },
        num_passenger: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        total_pay: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        code: {
            type: Sequelize.TEXT,
        },
        message_pay: {
            type: Sequelize.TEXT,
            defaultValue: null
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'book_tour_history',
            timestamps: false
        });
    Book_Tour_History.associate = (models) => {
        Book_Tour_History.belongsTo(models.tour_turns, { foreignKey: 'fk_tour_turn' })
        Book_Tour_History.belongsTo(models.book_tour_contact_info, { foreignKey: 'fk_contact_info' })
        Book_Tour_History.belongsTo(models.payment_method, { foreignKey: 'fk_payment' })
        Book_Tour_History.belongsTo(models.admins, { foreignKey: 'fk_staff' })
        Book_Tour_History.hasMany(models.passengers, { foreignKey: 'fk_book_tour' })
        Book_Tour_History.hasMany(models.cancel_booking, { foreignKey: 'fk_book_tour' })
    }
    return Book_Tour_History;
}
