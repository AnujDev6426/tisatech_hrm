const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const ContactUS = require('../../services/adminServices/contact.service.js')


exports.ContactUsGet = async (req, res, next) => { 
    try {
        const contact = await ContactUS.getContactUs(req,next);
        const response = successResponse(`contact have been get successfully`, contact);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};
