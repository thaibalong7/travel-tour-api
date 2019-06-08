module.exports = function (sequelize, Sequelize) {
    var roles_admin = sequelize.define('roles_admin', {
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
            tableName: 'roles_admin',
            timestamps: false
        });

    roles_admin.associate = (models) => {
        roles_admin.hasMany(models.admins, { foreignKey: 'fk_role' })
    }
    return roles_admin;
}