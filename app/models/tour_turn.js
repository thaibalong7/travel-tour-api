module.exports = function (sequelize, Sequelize) {
  var Tour_Turn = sequelize.define('tour_turns', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    start_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    num_current_people: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    num_max_people: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    discount: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    view: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    status: {
      type: Sequelize.ENUM('public', 'private')
    }
  },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      tableName: 'tour_turns',
      timestamps: false
    });

  Tour_Turn.associate = (models) => {
    Tour_Turn.belongsTo(models.tours, { foreignKey: 'fk_tour' })
    Tour_Turn.hasMany(models.price_passenger, { foreignKey: 'fk_tourturn' })
    Tour_Turn.hasMany(models.book_tour_history, { foreignKey: 'fk_tour_turn' })
  }
  return Tour_Turn;
}
