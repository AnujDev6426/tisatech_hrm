const { Branch} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');


//to handle Branch data
exports.handleBranch = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createBranch(req, next) : updateBranch(req , next);
}
//to create Branch
createBranch = async(req , next) => {
    try {
    const Branch_data = await Branch.create(req.body);
    return Branch_data; 
    } catch (err) {
        console.log(err);
        return next(err); // Handle the error properly

    }
     
}

//to update Branch
updateBranch = async(req , next) => {
     try {
    const Branch = await Branch.update(req.body,{ where:{id:req.body.id}});
    return {id:req.body.id};  
    // return;
     }
     catch (error) {
        return next(error); // Handle the error properly
    }
}




//to get branch
exports.getBranch = async (req, next) => {
    try {

        const { page, limit, search } = req.body;
        console.log(page, limit);
        var whereJson = {};
        const offset = (page - 1) * limit;
        const totalCount = await Branch.count({
            where: whereJson,
        });
        const totalPages = Math.ceil(totalCount / limit);
        const BranchList = await Branch.findAll({
            // where: whereJson,
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        // Add serial numbers to the Branchs
        const BranchListWithSerial = BranchList.map((Branch, index) => ({
            serialNumber: (offset + index + 1), // Generate serial number based on pagination
            ...Branch.dataValues, // Add Branch data values
        }));
        return {
            BranchList: BranchListWithSerial,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};

// to get branch Legacy

exports.getLegacyBranch = async (req, next) => {
    try {
        const BranchList = await Branch.findAll({
            order: [['id', 'DESC']],  // Order by ID descending
        });
        return  BranchList
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};

