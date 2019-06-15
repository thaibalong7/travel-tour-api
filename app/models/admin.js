'use strict'
module.exports = (sequelize, Sequelize) => {
    var Admin = sequelize.define('admins', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        birthdate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'admins',
            timestamps: false
        });

    Admin.associate = (models) => {
        Admin.belongsTo(models.roles_admin, { foreignKey: 'fk_role' });
        Admin.hasMany(models.book_tour_history, { foreignKey: 'fk_staff' });
        Admin.hasMany(models.cancel_booking, { foreignKey: 'fk_staff' })
    }

    return Admin;
}