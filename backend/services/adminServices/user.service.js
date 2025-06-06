const { User, Company, CompanyBank, Document, CompanyAddress } = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');
const jwtConfig = require('../../config/jwt.config');
const jwtUtil = require('../../utils/jwt.util');



//to get user
exports.getUser = async (req, next) => {
    try {
        const { page, limit, search, start_date, end_date } = req.body;
        var whereJson = { user_role_id: 0 }
        const offset = (page - 1) * limit;

        if (search) {
            whereJson = {
                ...whereJson,
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },    // search by comapy name
                    { email: { [Op.like]: `%${search}%` } },// search by comapy email
                    { mobile: { [Op.like]: `%${search}%` } }, // search by comapy mobile
                ]
            };
        }

        // date filter
        if (start_date && end_date) {
            whereJson = {
                ...whereJson,
                created_at: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: `${end_date}T23:59:59`
                }

            }
        }
        const userList = await User.findAll({
            where: whereJson,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        return userList;
    } catch (error) {
        next(error); // Handle the error properly
    }
}


//to buyer and seller company
exports.getSellerBuyer = async (req, next) => {
    try {
        const { role_id, page, limit, search, start_date, end_date } = req.body;
        var whereJson = { user_role_Id: role_id }
        if (search) {
            whereJson = {
                ...whereJson,
                [Op.or]: [
                    { company_name: { [Op.like]: `%${search}%` } },    // search by comapy name
                    { company_email: { [Op.like]: `%${search}%` } },// search by comapy email
                    { company_mobile: { [Op.like]: `%${search}%` } }, // search by comapy mobile
                ]
            };
        }

        // date filter
        if (start_date && end_date) {
            whereJson = {
                ...whereJson,
                created_at: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: `${end_date}T23:59:59`
                }

            }
        }
        // offset for pagination
        const offset = (page - 1) * limit;
        //get data using using role_id

        let bothList = await Company.findAndCountAll({
            where: whereJson,
            include: [
                {
                    model: User,
                    as: 'user_detail',
                    required: false,
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
        })
        return bothList;
    } catch (error) {
        console.log(error)
        next(error); // Handle the error properly
    }
}

// to get  company Details 
exports.companyDetails = async (req, next) => {
    if (req.body) {
        // to get user select company data
        const companydata = await Company.findOne({
            where: { user_id: req?.body.user_id, id: req.body.company_id },
            include: [{
                model: CompanyBank,
                as: "company_bank",
                include: [
                    {
                        model: Document,
                        as: 'documents',
                        attributes: ['document', 'document_type'], 
                        required: true,
                        where: {
                            document_type: {
                                [Op.in]: ['bank_statement', 'itr_document'] 
                            }
                        }
                    }
                ]
            },

            {
                model: CompanyAddress,
                as: "company_address",
                include: [
                    {
                        model: Document,
                        as: 'documents',
                        attributes: ['document', 'document_type'], 
                        required: true,
                        where: {
                            document_type: {
                                [Op.in]: ['address_proof'] 
                            }
                        }
                    }
                ]
            },
            {
                model: Document,
                as: 'documents',
                attributes: ['document', 'document_type'],
                required: true,
                where: {
                    document_type: {
                        [Op.in]: ['company_pancard_document', 'gst_document', 'other_document'] // Filter documents by type
                    }
                }
            }
            ]

        })
        return companydata
    }
}