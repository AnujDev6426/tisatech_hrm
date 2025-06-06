const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Laser = sequelize.define('Laser', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        branch_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        deposit_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        duo_amount: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        discount_amount	: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        pay_amount	: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        actual_amount	: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        payment_mode	: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        
        download_time	: {
            type: DataTypes.INTEGER,
           allowNull: false,
           defaultValue: 0
        },
    }, {
        tableName: 'laser',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    Laser.associate = function(models) {
        Laser.belongsTo(models.User, {
          foreignKey: 'user_id',
          as: 'user_details',
        });
        Laser.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course_details',
          });
      };


    return Laser;
};
