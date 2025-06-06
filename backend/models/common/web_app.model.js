const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WebAppContentMasters = sequelize.define('WebAppContentMasters', {
    source_type: {
      type: DataTypes.STRING,
      allowNull: true, // Set to false if it's required
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true, // Set to false if it's required
    },
    datas: {
      type: DataTypes.TEXT,
      allowNull: true, // Set to false if it's required
    },
  }, {
    tableName: 'web_app_content_masters', // Adjust the table name as needed
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Define associations if necessary
  WebAppContentMasters.associate = function(models) {
    // Example: WebAppContentMasters.belongsTo(models.OtherModel, { foreignKey: 'otherModelId' });
  };

  return WebAppContentMasters;
};
