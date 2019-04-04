module.exports = function (sequelize, Sequelize) {
    var Review = sequelize.define('reviews', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        comment: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        rate: {
            type: Sequelize.FLOAT,
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'reviews',
            timestamps: true
        });
    Review.associate = (models) => {
        Review.belongsTo(models.tours, { foreignKey: 'fk_tour' })
    }
    return Review;
}
