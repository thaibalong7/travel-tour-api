'use strict'
module.exports = function (sequelize, Sequelize) {
    var Provinces = sequelize.define('provinces', {
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
            tableName: 'provinces',
            timestamps: false
        });
    Provinces.associate = (models) => {
        Provinces.belongsTo(models.countries, { foreignKey: 'fk_country' })
        Provinces.hasMany(models.tour_provinces, { foreignKey: 'fk_province' })
        Provinces.hasMany(models.locations, { foreignKey: 'fk_province' })
    }
    return Provinces;
}