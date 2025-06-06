const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Batch = sequelize.define('Batch', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        batch_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        branch_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        faculty : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_time : {
            type: DataTypes.TIME,
            allowNull: false,
        },
        end_time : {
            type: DataTypes.TIME,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: "Y", // Default to 'verification-pending'
        },
    }, {
        tableName: 'batch',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });


    Batch.associate = function(models) {
        Batch.hasMany(models.StudentBatch, {
          foreignKey: 'batch_id',
          as: 'batch_details',
        });

        Batch.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course_details',
          });

          Batch.belongsTo(models.Branch, {
            foreignKey: 'branch_id',
            as: 'branch_details',
          });

      };








    

    return Batch;
};
