const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const DashboardService  =  require("../../services/adminServices/dashboard.service.js")

exports.GetDetails = async (req, res, next) => { 
    try {
        const course = await DashboardService.getDetails(req,next);
        const response = successResponse(`fees have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        console.log(err);
        return next(err);
    }
};


exports.GetCourseList = async (req, res, next) => { 
    try {
        const course = await DashboardService.CourseFindList(req,next);
        const response = successResponse(`Courese have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        console.log(err);
        return next(err);
    }
};

exports.GetBCAList = async (req, res, next) => { 
    try {
        const course = await DashboardService.getAllBCAStudent(req,next);
        const response = successResponse(`BCA List have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        console.log(err);
        return next(err);
    }
};



exports.getLaser = async (req, res, next) => { 
    try {
        const course = await DashboardService.getLaserDetails(req,next);
        const response = successResponse(`fees have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        console.log(err);
        return next(err);
    }
};