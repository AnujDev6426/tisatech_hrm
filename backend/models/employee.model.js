const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        salary: {
            type: DataTypes.DOUBLE,
        },
        designation: {
            type: DataTypes.STRING(150),
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true, // Ensure email is unique
            validate: {
                isEmail: true, // Validate email format
            },
        },
        mobile: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        join_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: "Y", // Default to 'verification-pending'
        },
        role_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: 3, // Default to 'Only Register'
        },
      
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });


  
      
      
  return Employee;
};
