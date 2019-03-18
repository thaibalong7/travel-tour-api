module.exports = function (sequelize, Sequelize) {
    var Verification_Token = sequelize.define('verification_token', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        token: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {

            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'verification_token',
            timestamps: true
        });
    Verification_Token.associate = (models) => {
        Verification_Token.belongsTo(models.users, { foreignKey: 'user_id' })
    }
    return Verification_Token;
};
