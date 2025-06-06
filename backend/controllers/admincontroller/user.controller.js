const { successResponse } = require('../../utils/responseUtils.js');
const { BadRequestError } = require('../../utils/api-errors.js');
const UserService = require('../../services/adminServices/user.service');
const {validatecomapny} = require('../../validatons/admin.validation')

//to get user

// exports.getAllUserList = async(req, res, next) => {
//     try {
//         //get User List
//         const userList = await UserService.getUser(req , next);
//         // Send success response
//         const response = successResponse(`Successfully List Fatched..!`, userList);
//         res.status(response.statusCode).json(response.body);
//     } catch (err) {
//        return next(err);
//     }
// }



