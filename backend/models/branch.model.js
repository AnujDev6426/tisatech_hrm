const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Branch = sequelize.define('Branch', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true, // Ensure email is unique
            validate: {
                isEmail: true, // Validate email format
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: "Y", // Default to 'verification-pending'
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        branch_collection: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'branch',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    

    return Branch;
};
