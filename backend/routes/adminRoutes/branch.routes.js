const express = require('express');
const router = express.Router();
const BranchController = require('../../controllers/admincontroller/branch.controller');


// branch controller
router.post('/add-branch', BranchController.branchAdd);
router.post('/get-branch', BranchController.getAllbranchList);

module.exports = router
