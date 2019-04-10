'use strict'
module.exports = function (sequelize, Sequelize) {
    var Tour_Provinces = sequelize.define('tour_provinces', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'tour_provinces',
            timestamps: false
        });
    Tour_Provinces.associate = (models) => {
        Tour_Provinces.belongsTo(models.provinces, { foreignKey: 'fk_province' })
        Tour_Provinces.belongsTo(models.tours, { foreignKey: 'fk_tour' })
    }
    return Tour_Provinces;
}