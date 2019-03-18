module.exports = function (sequelize, Sequelize) {
    var Price_Passenger = sequelize.define('price_passenger', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        percent: {
            type: Sequelize.INTEGER,
            defaultValue: 100
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'price_passenger',
            timestamps: false
        });
        Price_Passenger.associate = (models) =>{
            Price_Passenger.belongsTo(models.tour_turns, { foreignKey: 'fk_tourturn' })
            Price_Passenger.belongsTo(models.type_passenger, { foreignKey: 'fk_type_passenger' })
        }

    return Price_Passenger
}