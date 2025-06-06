const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'user_roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Role.associate = function(models) {
    // Define associations here if needed, for example:
    // Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
  };

  return Role;
};
