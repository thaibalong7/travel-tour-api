module.exports = function (sequelize, Sequelize) {
	var Tour = sequelize.define('tours', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		detail: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		featured_img: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		policy: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		average_rating: {
			type: Sequelize.FLOAT,
			defaultValue: 0
		}
	},
		{
			charset: 'utf8',
			collate: 'utf8_unicode_ci',
			tableName: 'tours',
			timestamps: false
		});

	Tour.associate = (models) => {
		Tour.hasMany(models.routes, { foreignKey: 'fk_tour' })
		Tour.hasMany(models.reviews, { foreignKey: 'fk_tour' })
		Tour.hasMany(models.tour_turns, { foreignKey: 'fk_tour' })
		Tour.hasMany(models.tour_images, { foreignKey: 'fk_tour' })
		Tour.hasMany(models.tour_countries, { foreignKey: 'fk_tour' })
		Tour.hasMany(models.tour_provinces, { foreignKey: 'fk_tour' })
		Tour.belongsTo(models.type_tour, { foreignKey: 'fk_type_tour' })
	}
	return Tour;
}
