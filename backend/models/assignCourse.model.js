const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AssignCourse = sequelize.define('AssignCourse', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Y', 'N'),  // Explicit enum values
            defaultValue: 'Y', // Default value
        },
    }, {
        tableName: 'assign_course',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    AssignCourse.associate = function(models) {
        AssignCourse.belongsTo(models.User, {
          foreignKey: 'user_id',
          as: 'user_details',
        });
        AssignCourse.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course_details',
          });
      };

    return AssignCourse;
};
