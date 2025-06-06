const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const BatchService = require('../../services/adminServices/batch.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to Batch added
exports.batchAdd = async (req, res, next) => { 
    try {
        // Create new Batch or update batch
        const batch = await BatchService.handleBatch(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Batch details have been ${msg} successfully`, batch);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err.message);
    }
};





//to get Student
exports.getAllBatchList = async(req, res, next) => {
    try {
        //get Student List
        const BatchList = await BatchService.getBatch(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, BatchList);
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
 
// findOne Batch 
exports.getOneBatchDetails = async(req, res, next) => {
    try {
        //get template  List
        const Batch_list = await BatchService.BatchFind(req , next);
        // Send success response
        const response = successResponse(`Successfully Batch List Fatched..!`, Batch_list);
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

exports.BatchStudentAdd = async(req, res, next) => {
    try {
        //get template  List
        const Batch = await BatchService.studentAdd(req , next);
        // Send success response
        const response = successResponse(`Student batch assign successfully`, Batch);
        res.status(response.statusCode).json(response.body);
        } catch (err) {
            return next(err);
        }  
}

exports.BatchStudentView = async(req, res, next) => {
    try {
        //get template  List
        const Batch = await BatchService.batch_student_list(req , next);
        // Send success response
        const response = successResponse(`Student batch assign successfully`, Batch);
        res.status(response.statusCode).json(response.body);
        } catch (err) {
            return next(err);
        }  
}



//Batch status Change / Update
exports.statusUpdateBatch = async(req, res, next) => {
    try {
        //get Specification  List
        const data = await BatchService.updateBatchStatus(req , next);
        // Send success response
        const response = successResponse(`Batch Status have been update successfully`, data);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


// Batch deletd
exports.DeletedBatch = async(req, res, next) => {
    try {
        //get Specification  List
        const data = await BatchService.BatchDeleted(req , next);
        // Send success response
        const response = successResponse(`Batch deleted successfully!`, data);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


// Students deleted in batch
exports.DeletedStudents = async(req, res, next) => {
    try {
        //get Specification  List
        const data = await BatchService.StudentDeleted(req , next);
        // Send success response
        const response = successResponse(`Student deleted In The Batch!`, data);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

// Students attendance Pdf 
exports.attendancePdf = async(req, res, next) => {
    try {
        //get Specification  List
        const data = await BatchService.attendancePdf(req , next);
        // Send success response
        const response = successResponse(`Student attendance pdf download!`, data);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}