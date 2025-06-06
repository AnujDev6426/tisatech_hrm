const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const CourseService = require('../../services/adminServices/course.service.js');
const FeesService  =  require("../../services/adminServices/fees.service.js")


//Create student fees

exports.feesAdd = async (req, res, next) => { 
    try {
        const course = await FeesService.handleFees(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`fees have been ${msg} successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


exports.feeGet = async (req, res, next) => { 
    try {
        const course = await FeesService.getFeesList(req, res,next);
        const response = successResponse(`fees have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};

exports.feesDetails = async (req, res, next) => { 
    try {
        const course = await FeesService.getFeesDetsils(req,next);
        const response = successResponse(`fees have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};