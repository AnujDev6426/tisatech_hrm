const express = require('express');
const router = express.Router();
const AssignCourseController = require('../../controllers/admincontroller/assignCourse.controller')


// AssignCourse Controller
router.post('/get-assignCourse', AssignCourseController.getAllassignCourseList);

module.exports = router
