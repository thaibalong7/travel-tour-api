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
    start_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    num_current_people: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    num_max_people: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  },
  {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'tours',
    timestamps: false
  });

  Tour.associate = (models) => {
    Tour.hasMany(models.routes, {foreignKey: 'fk_tour'})
  }
  return Tour;
}
