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
            type: Sequelize.ENUM('booked', 'paid', 'cancelled'),
            defaultValue: 'booked'
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
        Book_Tour_History.belongsTo(models.users, { foreignKey: 'fk_user' })
        Book_Tour_History.belongsTo(models.payment_method, { foreignKey: 'fk_payment' })
        Book_Tour_History.hasMany(models.passengers, {foreignKey: 'fk_book_tour'})
    }
    return Book_Tour_History;
}
