const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Followup = sequelize.define('Followup', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        father_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        f_responce : {
            type: DataTypes.TEXT(),
            allowNull: true,
        },
        message : {
            type: DataTypes.JSON,
            allowNull: true,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: true,
            defaultValue: "1", // Default to 'verification-pending'
        },
    }, {
        tableName: 'followup',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    

    return Followup;
};
