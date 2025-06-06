const express = require('express');
const router = express.Router();
const employeeRoutes = require('../../controllers/admincontroller/employee.controller');


//EmployeeController
router.post('/add-employee', employeeRoutes.EmployeeAdd);
router.post('/view-employee', employeeRoutes.getAllEmployeeAddList);
router.post('/get-employeedetails', employeeRoutes.getOneEmployeeDetails);

module.exports = router
