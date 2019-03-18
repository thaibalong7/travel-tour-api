module.exports = function (sequelize, Sequelize) {
    var Type_Passenger = sequelize.define('type_passenger', {
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
            tableName: 'type_passenger',
            timestamps: false
        });

    Type_Passenger.associate = (models) => {
        Type_Passenger.hasMany(models.price_passenger, { foreignKey: 'fk_type_passenger' })
        Type_Passenger.hasMany(models.passengers, { foreignKey: 'fk_type_passenger' })
    }
    return Type_Passenger;
}