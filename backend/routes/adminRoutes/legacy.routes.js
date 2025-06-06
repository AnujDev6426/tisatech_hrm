const express = require('express');
const router = express.Router();
const CourseController = require('../../controllers/admincontroller/course.controller');
const StudentController = require('../../controllers/admincontroller/student.controller');
const BranchController = require('../../controllers/admincontroller/branch.controller');
const LaserController = require('../../controllers/admincontroller/laser.controller');


// Legacy controller
router.post('/getLegacyBranch', BranchController.getLegacybranchList);
router.post('/getLegacyCourse', CourseController.getLegacyCourseList);
router.post('/getLegacyStudent', StudentController.getStudentList);
router.post('/add-laser', LaserController.LaserAdd);
router.post('/get-laser', LaserController.getAllLaserList);
router.post('/laser-details', LaserController.LaserDetails);
router.post('/fees-pdf-create', LaserController.CreatePdf);
router.post('/already-paid-fees', LaserController.FindPaidFees);

module.exports = router
