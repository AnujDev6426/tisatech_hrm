const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const StudentBatch = sequelize.define('StudentBatch', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        batch_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Y', 'N'),  // Explicit enum values
            defaultValue: 'Y', // Default value
        },
    }, {
        tableName: 'student_batch',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
   
    StudentBatch.associate = function(models) {
        StudentBatch.belongsTo(models.User, {
          foreignKey: 'student_id',
          as: 'student_details',
        });
        StudentBatch.belongsTo(models.Batch, {
            foreignKey: 'batch_id',
            as: 'batch_details',
          });

        //   StudentBatch.belongsTo(models.Branch, {
        //     foreignKey: 'branch_id',
        //     as: 'branch_details',
        //   });

      };




    return StudentBatch;
};
