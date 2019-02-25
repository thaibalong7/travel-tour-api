module.exports = function (sequelize, Sequelize) {
  var Route = sequelize.define('routes', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    arrive_time: {
      type: Sequelize.TIME,
      allowNull: false
    },
    leave_time: {
      type: Sequelize.TIME,
      allowNull: false
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
  }
  return Route;
}
