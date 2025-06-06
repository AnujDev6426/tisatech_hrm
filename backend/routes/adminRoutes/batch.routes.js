const express = require('express');
const router = express.Router();
const batchController = require('../../controllers/admincontroller/batch.controller');


// Batch Controller
router.post('/add-batch', batchController.batchAdd);
router.post('/get-batch', batchController.getAllBatchList);
router.post('/batch-add-student', batchController.BatchStudentAdd);
router.post('/batch-list-student', batchController.BatchStudentView);
router.post('/batch-detail', batchController.getOneBatchDetails);
router.post("/batch-status", batchController.statusUpdateBatch);
router.post("/batch-deleted", batchController.DeletedBatch);
router.post("/student-deleted", batchController.DeletedStudents);
router.post("/student-attendance-pdf", batchController.attendancePdf);

module.exports = router
