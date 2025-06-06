const { AssignCourse , User ,Course} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');





//to get assignCourse
exports.getassignCourse = async (req, next) => {
    try {
        const AssignCourseList = await AssignCourse.findAll({
            order: [['id', 'DESC']],
            include:[
                {
                    model:User,
                    as:'user_details'
                },
                {
                    model:Course,
                    as:'course_details'
                }
            ],  
            distinct: true,
        });
        return AssignCourseList
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};
