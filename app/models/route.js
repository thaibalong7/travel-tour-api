module.exports = function(sequelize, Sequelize) {
  var Route = sequelize.define('routes', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    arrive_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'routes',
    timestamps: false
  });

  Route.associate = (models) => {
    Route.belongsTo(models.tours, {foreignKey: 'fk_tour'})
    Route.belongsTo(models.locations, {foreignKey: 'fk_location'})
  }
  return Route;
}
