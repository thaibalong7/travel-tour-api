'use strict'
module.exports = function (sequelize, Sequelize) {
    var Tour_Countries = sequelize.define('tour_countries', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'tour_countries',
            timestamps: false
        });
    Tour_Countries.associate = (models) => {
        Tour_Countries.belongsTo(models.countries, { foreignKey: 'fk_country' })
        Tour_Countries.belongsTo(models.tours, { foreignKey: 'fk_tour' })
    }
    return Tour_Countries;
}