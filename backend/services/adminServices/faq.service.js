const {FAQ,Course } = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');


//to handle Faq data
exports.handleFAQ = async(req ,next) => {
    const action = req.body.action;
    return await action =='create' ? createFAQ(req, next) : updateFAQ(req , next);
}
//to create FAQ
const  createFAQ = async(req, next) => {
    try {
        const {question,course_id}=req.body
        for (const iterator of question) {
             await FAQ.create({
                question_text:iterator.question_text,
                	options:iterator.options,
                    correct_answer:iterator.correctAnswer,
                    course_id:course_id	
             });
            }
            return true; 
    
    } catch (err) {
        console.log(err);
    }
     
}

const updateFAQ = async (req, next) => {
    try {
      const { course_id, id, question } = req.body;
  
      console.log('Request body:', req.body);
  
      const findUser = await FAQ.findOne({ where: { id: id } });
      if (!findUser) {
        return next(new Conflict('FAQ data not found!'));
      }
  
      // Update FAQ
      const [affectedRows] = await FAQ.update(
        {
            question_text: question[0].question_text,
          options: question[0].options, // Ensure options is an array or JSON
          correct_answer: question[0].correctAnswer,
          course_id: course_id,
        },
        { where: { id: id } }
      );
  
      if (affectedRows === 0) {
        return next(new Conflict('FAQ update failed!'));
      }
  
      // Fetch the updated FAQ record
      const updatedFAQ = await FAQ.findOne({ where: { id: id } });
      return updatedFAQ;
  
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return next(error); // Handle the error properly
    }
  };
  


//to get FAQ
exports.getFAQ = async (req, next) => {
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
        const totalCount = await FAQ.count({
            where: {
                ...whereJson,
            },
            include: [
                {
                    model: Course,
                    as: 'Course_details',
                    required: false,
                }
            ],
            order: [['id', 'DESC']],  // Order by ID descending
            distinct: true,
                    
        });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);
                // Fetch the list of Users with the applied filters, pagination, and ordering
        const UserList = await FAQ.findAll({
            where: {
                ...whereJson,
            },
            include: [
                {
                    model: Course,
                    as: 'Course_details',
                    required: false,
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


// // findby id FAQ 
exports.FAQFind = async (req, next) => {
    if (req.body) {
        const id = req.body.id 
        // to get FAQ select company data
        const FAQ_data = await FAQ.findOne({
            where: { id: id }, 
        })
        return FAQ_data
    }
}


// faq
exports.FaqDelete = async (req, next) => {
    if (req.body) {
        const id = req.body.id 
        // to get user select company data
        const student_data = await FAQ.destroy({
            where: { id: id }, 
        })
        return student_data
    }
}