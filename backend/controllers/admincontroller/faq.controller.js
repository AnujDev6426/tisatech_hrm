const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const FAQService = require('../../services/adminServices/faq.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to FAQAdd added
exports.FAQAdd = async (req, res, next) => { 
    console.log(req.body);
    try {
        // Create new FAQAdd or update FAQAdd
        const student = await FAQService.handleFAQ(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Faq details have been ${msg} successfully`, student);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get FAQAdd
exports.getAllFAQList = async(req, res, next) => {
    console.log(req.body);
    try {
        //get FAQ List
        const FAQList = await FAQService.getFAQ(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, FAQList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

 
// findOne FAQ 
exports.getOneFAQDetails = async(req, res, next) => {
    try {
        //get template  List
        const Employee_list = await FAQService.FAQFind(req , next);
        // Send success response
        const response = successResponse(`Successfully Employee List Fatched..!`, Employee_list);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}



// FAQ deleted in batch
exports.DeletedFAQ = async(req, res, next) => {
    try {
        //get Specification  List
        const data = await FAQService.FaqDelete(req , next);
        // Send success response
        const response = successResponse(`FAQ deleted Successfully !`, data);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}


