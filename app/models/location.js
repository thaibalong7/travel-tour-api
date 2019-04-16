module.exports = function (sequelize, Sequelize) {
  var Location = sequelize.define('locations', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    latitude: {
      type: Sequelize.FLOAT(10, 6),
      allowNull: false
    },
    longitude: {
      type: Sequelize.FLOAT(10, 6),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    featured_img: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      tableName: 'locations',
      timestamps: false
    });

  Location.associate = (models) => {
    Location.belongsTo(models.types, { foreignKey: 'fk_type' })
    Location.belongsTo(models.provinces, { foreignKey: 'fk_province' })
    Location.hasMany(models.routes, { foreignKey: 'fk_location' })
  }
  return Location;
}
