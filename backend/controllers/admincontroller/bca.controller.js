const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const BacService = require('../../services/adminServices/bca.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to get  Bca Student
exports.getList = async(req, res, next) => {
    try {
        //get Student List
        const BatchList = await BacService.get(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, BatchList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

exports.UploadDocument = async(req, res, next) => {
    try {
        //get Student List
        const uploadDocument = await BacService.UploadDocument(req , next);
        // Send success response
        const response = successResponse(`Successfully Upload Document..!`, uploadDocument);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


exports.deleteDocument = async(req, res, next) => {
    try {
        //get Student List
        const documentdelete = await BacService.deleteDocument(req , next);
        // Send success response
        const response = successResponse(`Document delete Successfully ..!`, documentdelete);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

exports.detailDocument = async(req, res, next) => {
    try {
        //get Student List
        const documentdetails = await BacService.document_details(req , next);
        // Send success response
        const response = successResponse(`Document details Successfully ..!`, documentdetails);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}