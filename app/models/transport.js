module.exports = function (sequelize, Sequelize) {
    var Tranport = sequelize.define('transports', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name_vn: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name_en: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'transports',
            timestamps: false
        });

    Tranport.associate = (models) => {
        Tranport.hasMany(models.routes, { foreignKey: 'fk_transport' })
    }
    return Tranport;
}
