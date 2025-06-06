const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const EmployeeService = require('../../services/adminServices/employee.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to EmployeeAdd added
exports.EmployeeAdd = async (req, res, next) => { 
    try {
        // Create new EmployeeAdd or update EmployeeAdd
        const student = await EmployeeService.handleEmployee(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Employee details have been ${msg} successfully`, student);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get EmployeeAdd
exports.getAllEmployeeAddList = async(req, res, next) => {
    console.log(req.body);
    try {
        //get Employee List
        const StudentList = await EmployeeService.getemployee(req , next);
        // Send success response
        const response = successResponse(`All Employees fetched...!`, StudentList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
        console.log(err);
        return next(err);
    }
}


// //to get Employee for fees
exports.getEmployeeList = async(req, res, next) => {
    try {
        //get Employee List
        const StudentList = await StudentService.studentList(req , next);
        // Send success response
        const response = successResponse(`ALL Employess Successfully Fetched..!`, StudentList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {

       return next(err);
    }
}
 
// findOne Employee 
exports.getOneEmployeeDetails = async(req, res, next) => {
    try {
        //get template  List
        const Employee_list = await EmployeeService.EmployeeFind(req , next);
        // Send success response
        const response = successResponse(`Successfully Employee List Fatched..!`, Employee_list);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


// // find Course 
// exports.getStudentCourse = async(req, res, next) => {
//     try {
//         //get template  List
//         const Student_list = await StudentService.studentCourse(req , next);
//         // Send success response
//         const response = successResponse(`Successfully Student course List Fatched..!`, Student_list);
//         res.status(response.statusCode).json(response.body);
//         } catch (err) {
//             return next(err);
//         }  
// }


// // to Assign Course 
// exports.StudentAssignCourse = async(req, res, next) => {
//     try {
//         //get template  List
//         const Student_list = await StudentService.studentAssignCourse(req , next);
//         // Send success response
//         const response = successResponse(`Student course assign successfully`, Student_list);
//         res.status(response.statusCode).json(response.body);
//         } catch (err) {
//             return next(err);
//         }  
// }



// //to update status
// exports.stu_Update_Status = async (req, res, next) => { 
//     try {
//         // Create new student or update student
//         const student = await StudentService.updateStudentStatus(req,next);
//         const response = successResponse(`Student details have been  successfully`, student);
//         res.status(response.statusCode).json(response.body);
//     } catch (err) {    
//         return next(err);
//     }
// };
