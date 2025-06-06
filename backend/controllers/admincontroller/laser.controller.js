const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const LaserService = require('../../services/adminServices/Laser.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to Laser added
exports.LaserAdd = async (req, res, next) => { 
    try {
        // Create new Laser or update Laser
        const Laser = await LaserService.handleLaser(req,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`Laser details have been ${msg} successfully`, Laser);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get Laser
exports.getAllLaserList = async(req, res, next) => {
    try {
        //get Laser List
        const LaserList = await LaserService.getLegacy(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, LaserList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

exports.LaserDetails = async (req, res, next) => { 
    try {
        const course = await LaserService.getLegacyDetsils(req,next);
        const response = successResponse(`fees have been get successfully`, course);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};

exports.CreatePdf = async (req, res, next) => { 
    try {
        const pdfCreator = await LaserService.createPdf(req,next);
        
        const response = successResponse(`Pdf download successfully`, pdfCreator);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


exports.FindPaidFees = async (req, res, next) => { 
    try {
        const fees = await LaserService.FindPaidFees(req,next);
        
        const response = successResponse(`Pdf download successfully`, fees);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};
