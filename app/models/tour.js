module.exports = function(sequelize, Sequelize) {
  var Tour = sequelize.define('tours', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    detail: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    policy:{
      type: Sequelize.TEXT,
      allowNull: true
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'tours',
    timestamps: false
  });

  Tour.associate = (models) => {
    Tour.hasMany(models.routes, {foreignKey: 'fk_tour'})
    Tour.hasMany(models.comments, {foreignKey: 'fk_tour'})
    Tour.hasMany(models.ratings, {foreignKey: 'fk_tour'})
    Tour.hasMany(models.tour_turns, {foreignKey: 'fk_tour'})
  }
  return Tour;
}
