const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const assignCourseService = require('../../services/adminServices/assignCourse.service.js');

//to get assignCourse
exports.getAllassignCourseList = async(req, res, next) => {
    try {
        //get assignCourse List
        const assignCourseList = await assignCourseService.getassignCourse(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, assignCourseList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}
