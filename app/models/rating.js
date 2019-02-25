module.exports = function (sequelize, Sequelize) {
    var Rating = sequelize.define('ratings', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rate: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'ratings',
            timestamps: false
        });
    Rating.associate = (models) => {
        Rating.belongsTo(models.tours, { foreignKey: 'fk_tour' })
        Rating.belongsTo(models.users, { foreignKey: 'fk_user' })
    }
    return Rating;
}
