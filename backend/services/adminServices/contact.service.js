const { User , ContactUs} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');



//to get ContactUs
exports.getContactUs = async (req, next) => {
    try {
        const { page, limit,start_date,end_date } = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;
        if (start_date && end_date) {
            whereJson = {
                ...whereJson,
                created_at: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: new Date(`${end_date}T23:59:59`)
                }
            };
        }
        // Count total Users matching the criteria
        const totalCount = await ContactUs.count({
            where: {...whereJson},
            order: [['id', 'DESC']],  // Order by ID descending
            distinct: true,
                    
        });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);
                // Fetch the list of Users with the applied filters, pagination, and ordering
        const UserList = await ContactUs.findAll({
            where: {...whereJson},
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });
        return {
            UserList: UserList,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};
