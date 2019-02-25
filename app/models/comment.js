module.exports = function (sequelize, Sequelize) {
    var Comment = sequelize.define('comments', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'comments',
            timestamps: true
        });
    Comment.associate = (models) => {
        Comment.belongsTo(models.tours, { foreignKey: 'fk_tour' })
        Comment.belongsTo(models.users, { foreignKey: 'fk_user' })
    }
    return Comment;
}
