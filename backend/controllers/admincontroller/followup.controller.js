const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const FollowUpService = require('../../services/adminServices/followup.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to Follow-up added
exports.followUpAdd = async (req, res, next) => { 
    try {
        // Create new student or update student
        const followUp = await FollowUpService.handleFollowUp(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Follow-Up details have been ${msg} successfully`, followUp);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get Follow-up
exports.getAllFollowUpList = async(req, res, next) => {
    try {
        //get Follow-up List
        const followUpList = await FollowUpService.getFollowUp(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, followUpList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

 

exports.sendMessage = async(req  , res , next)=>{
    try {
        // Create new student or update student
        const followUp = await FollowUpService.sendMessage(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Follow-Up details have been ${msg} successfully`, followUp);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    } 
}


// findOne Follow-up msg 
exports.getOneFollowUpDetails = async(req, res, next) => {
    try {
        //get template  List
        const FollowUP_list = await FollowUpService.FollowUpFind(req , next);
        // Send success response
        const response = successResponse(`Successfully Follow-up List Fatched..!`, FollowUP_list);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}



//Batch status Change / Update
exports.statusUpdateFollowUp = async(req, res, next) => {
    try {
        //get Specification  List
        const data = await FollowUpService.updateFollowUpStatus(req , next);
        // Send success response
        const response = successResponse(`Follow-up Status have been update successfully`, data);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


// Import Excel data
exports.importExcel = async (req, res, next) => { 
    try {
        // Create new FollowUp or update student
        const followUp = await FollowUpService.ImportExcel(req,res,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Follow-Up details have been ${msg} successfully`, followUp);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};