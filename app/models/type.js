module.exports = function (sequelize, Sequelize) {
  var Type = sequelize.define('types', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    marker: {
      type: Sequelize.TEXT,
      allowNull: true
    },
  },
    {
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      tableName: 'types',
      timestamps: false
    });

  Type.associate = (models) => {
    Type.hasMany(models.locations, { foreignKey: 'fk_type' })
  }
  return Type;
}
