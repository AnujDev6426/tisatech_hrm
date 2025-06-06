const { User,Course ,Fees , AssignCourse , Legacy} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');


//to handle User data
exports.handleStudent = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createStudent(req, next) : updateStudent(req , next);
}
//to create Student
const  createStudent = async(req, next) => {
    try {
    const email  = await User.findOne({where:{email:req.body.email}})
     if(email){
    return next(new Conflict('email already exist!'));
     }else{

    const Student_data = await User.create(req.body);
    return Student_data; 
    }
    } catch (err) {
        console.log(err);
    }
     
}

//to update User
const updateStudent = async (req, next) => {
    try {
        const {user_id,name , username , email,mobile,dob,status,address,father_mobile,father_name,branch_id,reference_code} = req.body
        const findUser = await User.findOne({where:{id:user_id}})
        if(!findUser){
            return next(new Conflict('User data not found!'));
        }else{
         const UpdateUser = await User.update({
            name:name,
            username:username,
            email:email,
            mobile:mobile,
            dob:dob,
            status:status,
            address:address,
            father_mobile:father_mobile,
            father_name:father_name,
            branch_id:branch_id,
            reference_code:reference_code
         },{where:{id:user_id}}) 
         
         return UpdateUser
        }
     }
     catch (error) {
        return next(error); // Handle the error properly
    }
}


//to get Student
exports.getStudent = async (req, next) => {
    try {
        const { page, limit, search,start_date,end_date ,course_id} = req.body;
        var whereJson = {};
        var courseJson = {}
        const offset = (page - 1) * limit;
        // Apply search filters if search keyword is provided
        if (search) {
            whereJson = { 
                [Op.or]: [
                    { username: { [Op.like]: `%${search}%` } },    // Search by User name
                    // Uncomment and add other fields if needed
                    { email: { [Op.like]: `%${search}%` } }, // Search by email
                    { mobile: { [Op.like]: `%${search}%` } }, // Search by mobile

                ]
            };
        }

        if (course_id) {
            courseJson.course_id = {[Op.eq]:course_id}
        }
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
        const totalCount = await User.count({
            where: {
                ...whereJson,
                role_id: 2,  // Add this condition to fetch users with role_id 2
            },
            include: [
                {
                    model: AssignCourse,
                    as: 'course_details',
                    where:courseJson,
                    required: course_id ?  true : false,
                    include:[{
                        model: Course,
                        as: 'course_details',
                        required: false,
                        attributes:['name','fees','id']
                    }]
                }
            ],
            order: [['id', 'DESC']],  // Order by ID descending
            distinct: true,
                    
        });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);
                // Fetch the list of Users with the applied filters, pagination, and ordering
        const UserList = await User.findAll({
            where: {
                ...whereJson,
                role_id: 2,  // Add this condition to fetch users with role_id 2
            },
            include: [
                {
                    model: AssignCourse,
                    as: 'course_details',
                    where:courseJson,
                    required: course_id ?  true : false,
                    include:[{
                        model: Course,
                        as: 'course_details',
                        required: false,
                        attributes:['name','fees','id']
                    }]
                }
            ],
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        // Add serial numbers to the Users
        const UserListWithSerial = UserList.map((User, index) => ({
            serialNumber: (offset + index + 1), // Generate serial number based on pagination
            ...User.dataValues, // Add User data values
        }));

        // Return the paginated result with User details, total pages, and total count
        return {
            UserList: UserListWithSerial,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};


// findby id User 
exports.StudentFind = async (req, next) => {
    if (req.body) {
        const id = req.body.id 
        // to get user select company data
        const User_data = await User.findOne({
            where: { id: id }, 
        })
        return User_data
    }
}

// find course for student added
exports.studentCourse = async (req, next) => {
        // to get user select company data
        const User_data = await Course.findAll({
            order: [['id', 'DESC']], 
            attributes: ['id','cname','status'],
        })
        return User_data
}

// finde student list for fees
exports.studentList = async (req, next) => {
    // to get user select company data
    const User_data = await User.findAll({
        order: [['id', 'DESC']], 
        attributes: ['id','name','status', 'email' , 'mobile','father_mobile','father_name'],
        where:{status:"Y",role_id:2}
    })
    return User_data
}


// to Assign Course 
exports.studentAssignCourse = async(req ,next)=>{
    try {
      const createData = await AssignCourse.create(req.body)
      return createData  
    } catch (error) {
       return next(error) 
    }
}

exports.updateStudentStatus = async (req, next) => {
    try {
     const {status,id}=req.body
     const newStatus = status === "Y" ? "N" : "Y";
     const findUser = await User.findOne({where:{id:id}})
        if(!findUser){
            return next(new Conflict('User data not found!'));
        }else{
         const UpdateUser = await User.update({
            status:newStatus
         },{where:{id:id}}) 
         
         return UpdateUser
        }
     }
     catch (error) {
        return next(error); // Handle the error properly
    }
}