const express = require('express');
const router = express.Router();
const CourseController = require('../../controllers/admincontroller/course.controller');


// course  manager routes
router.post('/view-course', CourseController.getAllCourseList);
router.post('/add-course', CourseController.courseAdd);
router.post('/course-details', CourseController.getOneCourseDetails);

module.exports = router
