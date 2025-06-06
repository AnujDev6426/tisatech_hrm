const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
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
        user_profile: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        dob: {
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
            defaultValue: 2, // Default to 'Only Register'
        },
        reference_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        enrollment_id: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        branch_id: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        father_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        father_mobile: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });


    User.associate = function(models) {
        User.hasMany(models.AssignCourse, {
          foreignKey: 'user_id',
          as: 'course_details',
        });
      };

      User.beforeCreate(async (user, options) => {
        const latestUser = await User.findOne({
          order: [['enrollment_id', 'DESC']], // Get the user with the highest enrollment_id
          attributes: ['enrollment_id'],
        });
      
        // Ensure enrollment_id is parsed correctly
        const latestEnrollmentId = latestUser && latestUser.enrollment_id 
          ? parseInt(latestUser.enrollment_id, 10) // Parse to an integer
          : 0; // Default to 0 if no users exist
        
        console.log(latestEnrollmentId, 'Latest Enrollment ID');
      
        // Increment the enrollment_id and assign to the new user
        user.enrollment_id = (latestEnrollmentId + 1).toString(); // Increment and convert to string
      });
      
      
  return User;
};
