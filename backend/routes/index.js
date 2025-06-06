const express = require('express');
const router = express.Router();

// Admin Routes
const assingmentRoutes = require('./adminRoutes/assignCourse.routes');
const batchRoutes = require('./adminRoutes/batch.routes');
const branchRoutes = require('./adminRoutes/branch.routes');
const contactRoutes = require('./adminRoutes/contactUs.routes');
const courseRoutes = require('./adminRoutes/course.routes');
const dashRoutes = require('./adminRoutes/dashboard.routes');
const degreeRoutes = require('./adminRoutes/degreeCourse.routes');
const employeeRoutes = require('./adminRoutes/employee.routes');
const faqRoutes = require('./adminRoutes/faq.routes');
const followUpRoutes = require('./adminRoutes/followUp.routes');
const legacyRoutes = require('./adminRoutes/legacy.routes');
const studentRoutes = require('./adminRoutes/student.routes');

// Auth Routes
const authRoutes = require('./auth.routes');

// Middlewares
const uploadMiddleware = require('../middleware/uploadMiddleware');
const AuthGuard = require('../middleware/auth.middleware');

// Routing
router.use('/degree', uploadMiddleware, degreeRoutes)





router.all('*',  (req, res) => res.status(400).json({ status:false,message: 'Path not found..!'}));

module.exports = router;
 