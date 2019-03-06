module.exports = function (sequelize, Sequelize) {
    var Tour_Image = sequelize.define('tour_images', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'tour_images',
            timestamps: false
        });
    Tour_Image.associate = (models) => {
        Tour_Image.belongsTo(models.tours, { foreignKey: 'fk_tour' })
    }
    return Tour_Image;
}
