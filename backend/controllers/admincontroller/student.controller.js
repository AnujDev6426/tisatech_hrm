const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const StudentService = require('../../services/adminServices/student.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to student added
exports.studentAdd = async (req, res, next) => { 
    try {
        // Create new student or update student
        const student = await StudentService.handleStudent(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Student details have been ${msg} successfully`, student);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get Student
exports.getAllStudentList = async(req, res, next) => {
    try {
        //get Student List
        const StudentList = await StudentService.getStudent(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, StudentList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


//to get Student for fees
exports.getStudentList = async(req, res, next) => {
    try {
        //get Student List
        const StudentList = await StudentService.studentList(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, StudentList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}
 
// findOne Student 
exports.getOneStudentDetails = async(req, res, next) => {
    try {
        //get template  List
        const Student_list = await StudentService.StudentFind(req , next);
        // Send success response
        const response = successResponse(`Successfully Student List Fatched..!`, Student_list);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


// find Course 
exports.getStudentCourse = async(req, res, next) => {
    try {
        //get template  List
        const Student_list = await StudentService.studentCourse(req , next);
        // Send success response
        const response = successResponse(`Successfully Student course List Fatched..!`, Student_list);
        res.status(response.statusCode).json(response.body);
        } catch (err) {
            return next(err);
        }  
}


// to Assign Course 
exports.StudentAssignCourse = async(req, res, next) => {
    try {
        //get template  List
        const Student_list = await StudentService.studentAssignCourse(req , next);
        // Send success response
        const response = successResponse(`Student course assign successfully`, Student_list);
        res.status(response.statusCode).json(response.body);
        } catch (err) {
            return next(err);
        }  
}



//to update status
exports.stu_Update_Status = async (req, res, next) => { 
    try {
        // Create new student or update student
        const student = await StudentService.updateStudentStatus(req,next);
        const response = successResponse(`Student details have been  successfully`, student);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};
