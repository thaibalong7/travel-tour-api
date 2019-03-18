module.exports = function (sequelize, Sequelize) {
    var Payment_Method = sequelize.define('payment_method', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'payment_method',
            timestamps: false
        });

        Payment_Method.associate = (models) => {
            Payment_Method.hasMany(models.book_tour_history, { foreignKey: 'fk_payment' })
    }
    return Payment_Method;
}