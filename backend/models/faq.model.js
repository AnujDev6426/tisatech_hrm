const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FAQ = sequelize.define('FAQ', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        question_text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        options: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        correct_answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        course_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.ENUM('Y', 'N'),  // Explicit enum values
            defaultValue: 'Y', // Default value
        },
        
    }, {
        tableName: 'question',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    FAQ.associate = function(models) {

    FAQ.belongsTo(models.Course, {
        foreignKey: 'course_id',
        as: 'Course_details',
      });
    }
      
  return FAQ;
};
