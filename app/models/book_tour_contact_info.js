module.exports = function (sequelize, Sequelize) {
    var Book_Tour_Contact_Info = sequelize.define('book_tour_contact_info', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING,
        },
        fullname: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        passport: {
            type: Sequelize.STRING,
        }
    },
        {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'book_tour_contact_info',
            timestamps: false
        });
    Book_Tour_Contact_Info.associate = (models) => {
        Book_Tour_Contact_Info.belongsTo(models.users, { foreignKey: 'fk_user' })
        Book_Tour_Contact_Info.hasOne(models.book_tour_history, { foreignKey: 'fk_contact_info' })
    }
    return Book_Tour_Contact_Info;
}