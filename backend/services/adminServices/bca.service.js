const { Batch , StudentBatch,Course,Branch,User,AssignCourse ,Document,Laser} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');



//to get Bca Student
exports.get = async (req, next) => {
    try {
        const { page, limit, search , start_date , end_date} = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;

        const findOneData = await Course.findOne({where:{sort_name:'BCA'}})
    
        if (start_date && end_date) {
            whereJson = {
                ...whereJson,
                created_at: {
                    [Op.gte]: new Date(start_date),
                    [Op.lte]: new Date(`${end_date}T23:59:59`)
                }
            };
        }
        if (search) {
            whereJson = { 
                [Op.or]: [
                    { '$user_details.name$': { [Op.like]: `%${search?.trim()}%` } },
                    { '$user_details.email$': { [Op.like]: `%${search?.trim()}%` } },
                    { '$user_details.mobile$': { [Op.like]: `%${search?.trim()}%` } },
                ]
            };
        }
        
        if(findOneData?.id){
            whereJson.course_id ={[Op.eq]:findOneData?.id}
        }
        const totalCount = await AssignCourse.count({
            where: whereJson,
            include:[
                {
                    model: User, 
                    as: 'user_details'
                },
            ],
        });
        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);
        const data = await AssignCourse.findAll({
            where: {
                ...whereJson,
            },
            include:[
                {
                    model: User, 
                    as: 'user_details'
                },
            ],
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        const latestRecords = await Laser.findAll({
            where: { course_id:  5},
            attributes: [
                'user_id',
                [Sequelize.fn('MAX', Sequelize.col('created_at')), 'latestDate'],
            ],
            group: ['user_id'],
        });

        const studentIdsWithLatestDate = latestRecords.map((record) => ({
            user_id: record.user_id,
            created_at: record.dataValues.latestDate,
        }));

        const latestAmounts = await Laser.findOne({
            where: {
                course_id:5,  // Exclude course_id = 5
                [Op.or]: studentIdsWithLatestDate.map((entry) => ({
                    user_id: entry.user_id,
                    created_at: entry.created_at,
                })),
            },
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('actual_amount')), 'TotalActualAmount'],
                [Sequelize.fn('SUM', Sequelize.col('duo_amount')), 'DuoTotalamount'],
            ],
            raw: true,
        });

        const TotalPayAmount = await Laser.sum('pay_amount', {
            where: {
                course_id:  5  // Exclude course_id = 5
            },
        });

        // Extract calculated amounts safely
        const TotalActualAmount = latestAmounts?.TotalActualAmount || 0;
        const DuoTotalamount = latestAmounts?.DuoTotalamount || 0;
        const CorrectDueAmount = TotalActualAmount - TotalPayAmount;

     


        return {
            List: data,
            totalPages,
            currentPage: page,
            totalCount,
            TotalActualAmount,
            TotalPayAmount,
            DuoTotalamount:CorrectDueAmount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};


exports.UploadDocument = async (req, next) => {
    // Extract files from req.body
    const user_id = req.body.user_id
    const singleDocuments = [
        req.body.user_image,
        req.body.mark_sheet_12,
        req.body.mark_sheet_10,
        req.body.aadhar_back_document,
        req.body.aadhar_front_document,
    ].filter(file => file);

    const multipleDocuments = req.body.other_document || []; // Handle multiple files under 'other_document'

    // Flatten and filter files
    const allFiles = singleDocuments.concat(multipleDocuments).filter(file => file);

    // Fetch existing documents
    const existingDocuments = await Document.findAll({
        where: { user_id:user_id }
    });

    // Create a lookup for existing documents by type
    const existingDocsLookup = existingDocuments.reduce((acc, doc) => {
        const key = `${doc.document_type}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(doc);
        return acc;
    }, {});

    // Store old files to delete later
    let oldFilesToDelete = [];

    // Process each file
    for (const file of allFiles) {
        const [document_type, document] = file.split('/');

        // Check if document type already exists
        if (existingDocsLookup[document_type]) {
            
                // Update or replace the existing document with the new one
                const existingDoc = existingDocsLookup[document_type][0];
                if (existingDoc && existingDoc.document !== file) {
                    // Add the old file to the deletion list
                    oldFilesToDelete.push(existingDoc.document);

                    // Update the document
                    await Document.update(
                        { document: file },
                        {
                            where: { id: existingDoc.id },
                        }
                    );
                }
            
        } else {
            await Document.create({
                user_id: user_id,
                document: file,
                document_type
            });
        }
    }

    if (oldFilesToDelete.length > 0) {
        // await deleteUploadedFiles(oldFilesToDelete);
    }
};


exports.deleteDocument = async(req , next)=>{
    try {
     const {document_type , user_id} = req?.body
     const DeleteData =   await  Document.destroy({where:{user_id:user_id , document_type:document_type}})
     return DeleteData
    } catch (error) {
        next(error)
    }
}


exports.document_details = async(req , next)=>{
    try {
      const {user_id} = req.body 
      const findData = await Document.findAll({where:{user_id:user_id}}) 
      return findData
    } catch (error) {
        next(error)
    }
}