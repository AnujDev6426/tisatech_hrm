const express = require('express')
const router = express.Router()
const StudentController = require('../../controllers/admincontroller/student.controller');


// student controller
router.post('/view-student', StudentController.getAllStudentList);
// router.post('/get-assign-course', CourseController.getStudentAssignCourseList);
router.post('/add-student', StudentController.studentAdd);
router.post('/student-details', StudentController.getOneStudentDetails);
router.get('/view-student-course', StudentController.getStudentCourse);
router.post('/student-assignCourse', StudentController.StudentAssignCourse)
router.put('/student-statusupdate', StudentController.stu_Update_Status)

module.exports = router
