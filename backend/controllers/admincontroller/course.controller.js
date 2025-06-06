const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const CourseService = require('../../services/adminServices/course.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to course added
exports.courseAdd = async (req, res, next) => { 
    try {
        // Create new course or update course
        const course = await CourseService.handleCourse(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Course details have been ${msg} successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get Course
exports.getAllCourseList = async(req, res, next) => {
    try {
        //get Course List
        const courseList = await CourseService.getCourse(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, courseList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}



 
// findOne course 
exports.getOneCourseDetails = async(req, res, next) => {
    try {
        //get template  List
        const course_list = await CourseService.CourseFind(req , next);
        // Send success response
        const response = successResponse(`Successfully Course List Fatched..!`, course_list);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

//to get Legacy Course
exports.getLegacyCourseList = async(req, res, next) => {
    try {
        //get Course List
        const courseList = await CourseService.getLegacyCourse(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, courseList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

//to get assign courser list 
exports.getStudentAssignCourseList = async(req, res, next) => {
    try {
        //get Course List
        const courseList = await CourseService.getAssignLegacyCourse(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, courseList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}
