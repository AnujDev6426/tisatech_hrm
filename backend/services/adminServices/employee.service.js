const {Employee } = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');


//to handle User data
exports.handleEmployee = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createEmployee(req, next) : updateEmployee(req , next);
}

//to create Employee
const  createEmployee = async(req, next) => {
    try {
    const email  = await Employee.findOne({where:{email:req.body.email}})
     if(email){
    return next(new Conflict('email already exist!'));
     }else{

    const Student_data = await Employee.create(req.body);
    return Student_data; 
    }
    } catch (err) {
        console.log(err);
    }
     
}

//to update User
const updateEmployee = async (req, next) => {
    try {
        const {user_id,name,
            email,
            mobile,
            salary,
            designation,
            join_date} = req.body
        const findUser = await Employee.findOne({where:{id:user_id}})
        if(!findUser){
            return next(new Conflict('User data not found!'));
        }else{
         const UpdateUser = await Employee.update({
            name,
            email,
            mobile,
            salary,
            designation,
            join_date
         },{where:{id:user_id}}) 
         
         return UpdateUser
        }
     }
     catch (error) {
        return next(error); // Handle the error properly
    }
}

//to get Employee
exports.getemployee = async (req, next) => {
    // console.log(req.body);
    try {
        const { page, limit, search, start_date, end_date, course_id, attribute } = req.body;
        
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
        const totalCount = await Employee.count({
            where: {
                ...whereJson,
                role_id: 3,  // Add this condition to fetch users with role_id 2
            },
          
            order: [['id', 'DESC']],  // Order by ID descending
            distinct: true,
                    
        });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);
      
        // Fetch the list of Users with the applied filters, pagination, and ordering
        

        const UserList = await Employee.findAll({
            where: {
                ...whereJson,
                role_id: 3,  
            },
            attributes: attribute, 
            order: [['id', 'DESC']],  // Ordering by ID descending
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
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


// // findby id User 
// exports.EmployeeFind = async (req, next) => {
//     if (req.body) {
//         const id = req.body.id 
//         // to get user select company data
//         const User_data = await Employee.findOne({
//             where: { id: id }, 
//         })
//         return User_data
//     }
// }

// // find course for Employee added
// exports.studentCourse = async (req, next) => {
//         // to get user select company data
//         const User_data = await Course.findAll({
//             order: [['id', 'DESC']], 
//             attributes: ['id','cname','status'],
//         })
//         return User_data
// }

// // finde student list for fees
// exports.studentList = async (req, next) => {
//     // to get user select company data
//     const User_data = await User.findAll({
//         order: [['id', 'DESC']], 
//         attributes: ['id','name','status', 'email' , 'mobile','father_mobile','father_name'],
//         where:{status:"Y",role_id:2}
//     })
//     return User_data
// }


// // to Assign Course 
// exports.studentAssignCourse = async(req ,next)=>{
//     try {
//       const createData = await AssignCourse.create(req.body)
//       return createData  
//     } catch (error) {
//        return next(error) 
//     }
// }

// exports.updateStudentStatus = async (req, next) => {
//     try {
//      const {status,id}=req.body
//      const newStatus = status === "Y" ? "N" : "Y";
//      const findUser = await User.findOne({where:{id:id}})
//         if(!findUser){
//             return next(new Conflict('User data not found!'));
//         }else{
//          const UpdateUser = await User.update({
//             status:newStatus
//          },{where:{id:id}}) 
         
//          return UpdateUser
//         }
//      }
//      catch (error) {
//         return next(error); // Handle the error properly
//     }
// }