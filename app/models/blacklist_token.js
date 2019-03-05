module.exports = function (sequelize, Sequelize) {
    var Blacklist_token = sequelize.define('blacklist_tokens', {
        token: {
            type: Sequelize.TEXT
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'blacklist_tokens',
            timestamps: false
        });
    return Blacklist_token;
}
