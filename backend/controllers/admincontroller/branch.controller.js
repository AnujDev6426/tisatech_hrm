const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const BranchService = require('../../services/adminServices/branch.service.js');
// const {validatecomapny} = require('../../validatons/admin.validation')




//to branch added
exports.branchAdd = async (req, res, next) => { 
    try {
        // Create new branch or update branch
        const branch = await BranchService.handleBranch(req, res,next);
        const msg = req.body.action=='create' ? 'created' : 'modified';
        const response = successResponse(`branch details have been ${msg} successfully`, branch);
        res.status(response.statusCode).json(response.body);
    } catch (err) {    
        return next(err);
    }
};


//to get branch
exports.getAllbranchList = async(req, res, next) => {
    try {
        //get branch List
        const branchList = await BranchService.getBranch(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, branchList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}

//to get Legacy branch
exports.getLegacybranchList = async(req, res, next) => {
    try {
        //get branch List
        const branchList = await BranchService.getLegacyBranch(req , next);
        // Send success response
        const response = successResponse(`Successfully List Fatched..!`, branchList);
        res.status(response.statusCode).json(response.body);
    } catch (err) {
       return next(err);
    }
}
