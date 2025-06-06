const { Course , AssignCourse} = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');


//to handle course data
exports.handleCourse = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createCourse(req, next) : updateCourse(req , next);
}
//to create Course
const  createCourse = async(req , next) => {
    try {
    const finddata = await Course.findOne({where: { name: req.body.name }})
    if(finddata){
        return next(new Conflict('Course name alredy exit!'));
    }else{
        const course_data = await Course.create(req.body);
        return course_data; 
    }
    } catch (err) {
        console.log(err);
        return next(err); // Handle the error properly

    }
     
}

//to update Course
const updateCourse = async(req , next) => {
     try {
        const {name,fees,duration,description,seo_title,seo_keyword,seo_desc ,course_id,sort_name} = req?.body
    const finddata = await Course.findOne({where: { id: course_id } })
    if(!finddata){
        return next(new Conflict('Course data not found!'));
    }else{
     const Update = await Course.update({
      name:name,
      fees:fees,
      seo_desc:seo_desc,
      seo_keyword:seo_keyword,
      seo_title:seo_title,
      description:description,
      duration:duration,
      sort_name:sort_name,
     },{where:{id:course_id}}) 

     return Update
    }
     }
     catch (error) {
        console.log(error)
        return next(error); // Handle the error properly
    }
}

//to get course
exports.getCourse = async (req, next) => {
    try {
        const { page, limit, search } = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;

        // Apply search filters if search keyword is provided
        if (search) {
            whereJson = {
                ...whereJson,
                [Op.or]: [
                    { cname: { [Op.like]: `%${search}%` } },    // Search by course name
                    // Uncomment and add other fields if needed
                    // { email: { [Op.like]: `%${search}%` } }, // Search by email
                    // { mobile: { [Op.like]: `%${search}%` } }, // Search by mobile
                ]
            };
        }

        // Count total courses matching the criteria
        const totalCount = await Course.count({
            where: whereJson,
        });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch the list of courses with the applied filters, pagination, and ordering
        const courseList = await Course.findAll({
            // where: whereJson,
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        // Add serial numbers to the courses
        const courseListWithSerial = courseList.map((course, index) => ({
            serialNumber: (offset + index + 1), // Generate serial number based on pagination
            ...course.dataValues, // Add course data values
        }));

        // Return the paginated result with course details, total pages, and total count
        return {
            courseList: courseListWithSerial,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};

// findby id course 
exports.CourseFind = async (req, next) => {
    if (req.body) {
        const id = req.body.course_id 
        const Course_data = await Course.findOne({ where: { id: id } })
        return Course_data
    }
}


//to get Legacy course
exports.getLegacyCourse = async (req, next) => {
    try {
        const {student_id} = req?.body
        const Assigndata = await AssignCourse.findAll({where:{user_id:student_id}})
        const getIds = await Assigndata.map((res)=>{return res?.course_id})
        const courseList = await Course.findAll({
            where:{id:{[Op.in]:getIds}},
            order: [['id', 'DESC']],  
            distinct: true,
        });
        return courseList
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};


//for  assign course
exports.getAssignLegacyCourse = async (req, next) => {
    try {
        const courseList = await Course.findAll({
            order: [['id', 'DESC']],  
            distinct: true,
        });
        return courseList
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
};