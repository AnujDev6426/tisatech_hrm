const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ContactUs = sequelize.define('ContactUs', {
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
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        mobile: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        course: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: "0", // Default to 'verification-pending'
        },
    }, {
        tableName: 'contact_us',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    

    return ContactUs;
};
