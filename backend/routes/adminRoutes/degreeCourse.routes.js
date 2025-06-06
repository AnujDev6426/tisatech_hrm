const express = require('express');
const router = express.Router();
const BcaConttroller = require('../../controllers/admincontroller/bca.controller')


// BCA controller
router.post('/bac-list', BcaConttroller.getList)
router.post('/upload-document', BcaConttroller.UploadDocument);
router.post('/delete-document', BcaConttroller.deleteDocument);
router.post('/document-details', BcaConttroller.detailDocument);

module.exports = router
