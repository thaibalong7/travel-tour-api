'use strict'
module.exports = function (sequelize, Sequelize) {
    var Countries = sequelize.define('countries', {
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
            tableName: 'countries',
            timestamps: false
        });
    Countries.associate = (models) => {
        Countries.hasMany(models.provinces, { foreignKey: 'fk_country' })
        Countries.hasMany(models.tour_countries, { foreignKey: 'fk_country' })
    }
    return Countries;
}