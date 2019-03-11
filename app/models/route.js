module.exports = function (sequelize, Sequelize) {
  var Route = sequelize.define('routes', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    arrive_time: {
      type: Sequelize.TIME,
    },
    leave_time: {
      type: Sequelize.TIME,
    },
    day: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    detail: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      tableName: 'routes',
      timestamps: false
    });

  Route.associate = (models) => {
    Route.belongsTo(models.tours, { foreignKey: 'fk_tour' })
    Route.belongsTo(models.locations, { foreignKey: 'fk_location' })
    Route.belongsTo(models.transports, { foreignKey: 'fk_transport' })
  }
  return Route;
}
