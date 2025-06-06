const express = require('express');
const router = express.Router();
const DashboardController = require('../../controllers/admincontroller/dashboard.controller')

// Dashboard controller 
router.post('/get-dashboard-details', DashboardController.GetDetails);
router.post('/get-course-details', DashboardController.GetCourseList);
router.post('/get-BCA-Stu-details', DashboardController.GetBCAList);
router.post('/get-Laser-details', DashboardController.getLaser);

module.exports = router
