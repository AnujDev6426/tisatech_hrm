const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Course = sequelize.define('Course', {
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
        sort_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        fees: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        duration: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        description : {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        seo_title : {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        seo_keyword : {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        seo_desc : {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: "Y", // Default to 'verification-pending'
        },
    }, {
        tableName: 'course',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    

    return Course;
};
