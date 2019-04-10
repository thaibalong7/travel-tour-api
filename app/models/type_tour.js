'use strict'
module.exports = function (sequelize, Sequelize) {
    var Type_Tour = sequelize.define('type_tour', {
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
            tableName: 'type_tour',
            timestamps: false
        });
    Type_Tour.associate = (models) => {
        Type_Tour.hasMany(models.tours, { foreignKey: 'fk_type_tour' })
    }
    return Type_Tour;
}