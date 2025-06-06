const { Followup} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');


//to handle User data
exports.handleFollowUp = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createFollowUp(req, next) : updateFollowUp(req , next);
}
//to create Student
const  createFollowUp = async(req, next) => {
    try {
    const FollowUp_data = await Followup.create(req.body);
    return FollowUp_data; 

    } catch (err) {
        console.log(err);
    }
     
}

//to update User
const updateFollowUp = async (req, next) => {
    try {
        const {name,mobile ,address } = req.body
        const findUser = await Followup.findOne({where:{id:user_id}})
        if(!findUser){
            return next(new Conflict('User data not found!'));
        }else{
         const UpdateFollowUp = await User.update({
            name:name,
            address:address,
            mobile:mobile,
         },{where:{id:user_id}}) 
         
         return UpdateFollowUp
        }
     }
     catch (error) {
        return next(error); // Handle the error properly
    }
}

//to send message User
exports.sendMessage = async (req, next) => {
    try {
        const {message_id , message} = req.body
        const findUser = await Followup.findOne({where:{id:message_id}})
        if(!findUser){
            return next(new Conflict('User data not found!'));
        }else{

            let messages = JSON.parse(findUser?.message);

            messages.push(message)
            // const AllData =  findUser.message || [];
            // // AllData.push(message);
            // AllData.push(message)
         const UpdateFollowUp = await Followup.update({
            message:messages
         },{where:{id:message_id}}) 
         
         return UpdateFollowUp
        }
     }
     catch (error) {

        console.log(error)
        return next(error); // Handle the error properly
    }
}


//to get Follow-up
exports.getFollowUp = async (req, next) => {
    try {
        const { page, limit, search,updatedAt,status } = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;
        if (updatedAt) {
            // Define the start and end of the day for the given date
            const startOfDay = new Date(`${updatedAt}T00:00:00`);
            const endOfDay = new Date(`${updatedAt}T23:59:59`);
        
            // Validate date format before applying filter
            if (!isNaN(startOfDay) && !isNaN(endOfDay)) {
                whereJson.updatedAt = {
                    [Op.between]: [startOfDay, endOfDay],
                };
            }
        } if(status){
            whereJson.status ={[Op.eq]:status}
        }

        // Count total Users matching the criteria
        const totalCount = await Followup.count({
            where: whereJson,
        });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch the list of Followup with the applied filters, pagination, and ordering
        const FollowUpList = await Followup.findAll({
            where: {
                ...whereJson,
            },
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        // Add serial numbers to the Users
        const FollowUpListWithSerial = FollowUpList.map((User, index) => ({
            serialNumber: (offset + index + 1), // Generate serial number based on pagination
            ...User.dataValues, // Add User data values
        }));

        // Return the paginated result with User details, total pages, and total count
        return {
            FollowUpList: FollowUpListWithSerial,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};


// findby id Followup 
exports.FollowUpFind = async (req, next) => {
    if (req.body) {
        const id = req.body.id 
        // to get FollowUp select id data
        const FollowUp = await Followup.findOne({
            where: { id: id }, 
            attributes:['message','id','status','updatedAt','createdAt']
        })
        return FollowUp
    }
}

// Update Followup -status


exports.updateFollowUpStatus = async (req, res, next) => {
    try {
        // Determine the new status based on the current status
        // const newStatus = req.body.status === "Y" ? "N" : "Y";
        const newStatus = req.body.status;
        // Update the status in the database
        await Followup.update(
            { status: newStatus },
            { where: { id: req.body.id } }
        );
        return {id:req.body.id};  
    } catch (error) {
        return next(error); // Handle the error properly
    }
}



// import Excel

exports.ImportExcel = async(req, res,next)=> {
    const excelUsers = req.body.exceldata;
    if (excelUsers.length === 0) {
        return next(new Conflict('Select One File!'));
    }
    try {
        // Skip the first row for excel because the indexing starts at 0 (it's the header)
        for (let i = 1; i < excelUsers.length; i++) {
            const e = excelUsers[i];
            // Check if required fields are missing
            if (!e.name || !e.mobile||!e.father_name) {
                return next(new Conflict('Invalid file format. Please upload a valid CSV file to update the staff information.'));
            }
                await Followup.create({
                    name: e.name,
                    mobile: e.mobile,
                    address: e.address,
                    father_name:e.father_name,
                    message: []
                });
        }
    } catch (error) {
        return next(error); // Handle the error properly
    }
}












