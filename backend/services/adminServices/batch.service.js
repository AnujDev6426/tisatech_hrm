const { Batch, StudentBatch, Course, Branch, User } = require('../../models/connection.js');
const { Conflict, BadRequestError } = require('../../utils/api-errors.js');
const { Op, Sequelize, where } = require('sequelize');
const pdfCreator = require('pdf-creator-node');
const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment');
const { error } = require('console');


//to handle User data
exports.handleBatch = async (req, next) => {
    const action = req.body.action;
    return await action == 'create' ? createBatch(req, next) : updateBatch(req, next);
}
//to create batch
// const  createBatch = async(req, next) => {
//     try {
//     const Batch_data = await Batch.create(req.body);
//     return Batch_data; 
//     } catch (err) {
//         console.log(err.message);
//     }

// }

const createBatch = async (req, next) => {
    try {
        const { course_id } = req.body;
        // Step 1: Find the course by course_id
        const course = await Course.findByPk(course_id);
        if (!course) {
            throw new Error("Course not found");
        }

        // Step 2: Count the number of batches for this course
        const batchCount = await Batch.count({
            where: { course_id },
        });

        // Step 3: Generate batch_code
        const courseName = course.sort_name; // Assuming the Course model has a `name` field
        const batchCode = `TISA-${courseName}-${String(batchCount + 1).padStart(2, '0')}`;

        // Step 4: Set batch_code in req.body
        req.body.batch_code = batchCode;

        // Step 5: Create the batch
        const Batch_data = await Batch.create(req.body);
        return Batch_data;
    } catch (err) {
        // console.error(err.message);
        return next(err); // Handle the error properly
    }
};








//to update User
const updateBatch = async (req, next) => {
    try {
        const { batch_id, batch_code, start_date, end_date, course_id, start_time, end_time, faculty, branch_id } = req.body
        const findBatch = await Batch.findOne({ where: { id: batch_id } })
        if (!findBatch) {
            return next(new Conflict('User data not found!'));
        } else {
            // console.log("req111111111111111111",req.body)
            const BatchUpdate = await Batch.update({
                batch_code: batch_code,
                start_date: start_date,
                end_date: end_date,
                course_id: course_id,
                start_time: start_time,
                end_time: end_time,
                faculty: faculty,
                branch_id: branch_id,
            }, { where: { id: batch_id } })

            return BatchUpdate
        }
    }
    catch (error) {
        return next(error); // Handle the error properly
    }
}


//to get batch
exports.getBatch = async (req, next) => {
    try {
        const { page, limit, search, course_id, branch_id, start_time } = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;

        // Apply search filters if search keyword is provided


        if (course_id) {
            whereJson.course_id = { [Op.eq]: course_id }
        }
        if (branch_id) {
            whereJson.branch_id = { [Op.eq]: branch_id }
        } if (start_time) {
            whereJson.start_time = { [Op.eq]: start_time }
        }

        // Count total Users matching the criteria
        const totalCount = await Batch.count({
            where: whereJson,
        });
        // Calculate total pages for pagination

        const totalPages = Math.ceil(totalCount / limit);
        // Fetch the list of Users with the applied filters, pagination, and ordering
        const BatchList = await Batch.findAll({
            where: {
                ...whereJson,
                // role_id: 2,  // Add this condition to fetch users with role_id 2
            },
            include: [
                { model: Course, as: 'course_details' },
                { model: Branch, as: 'branch_details' },
                {
                    model: StudentBatch, as: "batch_details",
                    include: {
                        model: User,
                        where: search?.length > 0 ? { name: { [Op.like]: `%${search}%` } } : {},
                        required: search?.length > 0 ? true : false,
                        as: "student_details", attributes: ['name', 'id']
                    }
                }],
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        // Add serial numbers to the Users
        const BatchListWithSerial = BatchList.map((User, index) => ({
            serialNumber: (offset + index + 1), // Generate serial number based on pagination
            ...User.dataValues, // Add User data values
        }));

        // Return the paginated result with User details, total pages, and total count
        return {
            BatchList: BatchListWithSerial,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        // console.log(error);
        next(error); // Pass the error to the next middleware
    }
};


// findby id Batch 
exports.BatchFind = async (req, next) => {
    if (req.body) {
        const id = req.body.id
        // to get user select company data
        const Batch_data = await Batch.findOne({
            where: { id: id },
        })
        return Batch_data
    }
}

// find course for student added
exports.studentCourse = async (req, next) => {
    // to get user select company data
    const User_data = await Course.findAll({
        order: [['id', 'DESC']],
        attributes: ['id', 'cname', 'status'],
    })
    return User_data
}

// Batch Deleted
exports.updateBatchStatus = async (req, res, next) => {
    try {
        console.log(req.body);
        // Determine the new status based on the current status
        const newStatus = req.body.status === "Y" ? "N" : "Y";
        const UpdateUser = await Batch.update({
            status: newStatus
        }, { where: { id: req.body.id } })

        return UpdateUser
    }
    catch (error) {
        console.log(error);
        return next(error); // Handle the error properly
    }
}



exports.BatchDeleted = async (req, next) => {
    if (req.body) {
        const id = req.body.id
        // to get user select company data
        const Batch_data = await Batch.destroy({
            where: { id: id },
        })
        return Batch_data
    }
}
// Students added in batch
exports.studentAdd = async (req, next) => {
    try {
        const { student_id, batch_id } = req.body



        const findAlredyData = await StudentBatch.findAll({ where: { student_id: { [Op.in]: student_id }, batch_id: batch_id } })

        if (findAlredyData.length > 0) {
            return next(new Conflict("Student already assigned to this branch"));
        }
        else {
            await Promise.all((student_id.map(async (res) => (
                await StudentBatch.create({ student_id: res, batch_id: batch_id })
            ))))

            return true
        }

    } catch (error) {
        return next(error)
    }
}

// Student find in batch
exports.batch_student_list = async (req, next) => {
    try {
        const { page, limit, search } = req.body;
        var whereJson = {};
        const offset = (page - 1) * limit;

        const totalCount = await StudentBatch.count({
            where: { batch_id: search },
        });
        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);
        // Fetch the list of Users with the applied filters, pagination, and ordering
        const BatchList = await StudentBatch.findAll({
            where: { batch_id: search },
            include: [{ model: User, as: 'student_details' }, {
                model: Batch, as: "batch_details",
                include: [{ model: Course, as: 'course_details' }, { model: Branch, as: 'branch_details' }]
            }],
            order: [['id', 'DESC']],  // Order by ID descending
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        // Add serial numbers to the Users
        const BatchListWithSerial = BatchList.map((User, index) => ({
            serialNumber: (offset + index + 1), // Generate serial number based on pagination
            ...User.dataValues, // Add User data values
        }));

        // Return the paginated result with User details, total pages, and total count
        return {
            BatchList: BatchListWithSerial,
            totalPages,
            currentPage: page,
            totalCount,
        };
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
    }
}

// student deleted in the batch
exports.StudentDeleted = async (req, next) => {
    if (req.body) {
        const id = req.body.id
        // to get user select company data
        const student_data = await StudentBatch.destroy({
            where: { id: id },
        })
        return student_data
    }
}




// student attendance Fees
exports.attendancePdf = async (req, next) => {
    try {
        const { batch_id } = req.body
        const findBatchData = await Batch.findOne({ where: { id: batch_id } })
        const html = fs.readFileSync(path.join(__dirname, '../../view/Attendance-2.html'), 'utf-8');
        const getMonth = new Date().getMonth()
        const month_last_date = moment().endOf('month').date()

        const filename = Math.random() + findBatchData?.batch_code + getMonth + 'attendance' + '.pdf';
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dateArray = []
        for (let index = 1; index <= month_last_date; index++) {
            dateArray.push(index)
        }
        const facultyIds = findBatchData?.faculty?.split(',').map(id => Number(id.trim()));

        const facultyArray = await User.findAll({
            where: { id: { [Op.in]: facultyIds } },
            attributes: ['id', 'username']
        })



        const BatchList = await Batch.findAll({
            where: { id: batch_id },
            include: [
                { model: Branch, as: 'branch_details' },
                {
                    model: StudentBatch, as: "batch_details",
                    include: {
                        model: User,
                        required: true,
                        where: { status: 'Y' },
                        as: "student_details",
                        attributes: ['name', 'id']
                    }
                }],
            order: [['id', 'DESC']],  // Order by ID descending
            distinct: true,
        });

        const studentArray = []
        await Promise.all((BatchList?.map((res, i) => (
            res?.batch_details?.map((resp) => (
                studentArray?.push({ name: resp?.student_details?.name, srNo: studentArray?.length + 1 })
            ))
        ))))

        if (studentArray.length === 0) {
            throw new Error("Empty Batch!");
        }
        
        const obj = {
            batchData: findBatchData,
            studentArray: studentArray,
            date: month[getMonth],
            dates: dateArray,
            faculty: facultyArray
        }

        var options = {
            childProcessOptions: {
                env: {
                    OPENSSL_CONF: '/dev/null',
                },
            },
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "2mm",
                contents: '<div style="text-align: center"></div>'
            },
            footer: {
                height: "2mm",
            }
        };
        var document = {
            html: html,
            data: {
                batch_detail: obj,
            },
            path: './docs/' + filename,
            type: "",
        };

        const result = await pdfCreator.create(document, options)
        const pdfUrl = `${process.env.WebUrl}/docs/${filename}`;


        return pdfUrl
    } catch (error) {
        next(error)
    }
}
