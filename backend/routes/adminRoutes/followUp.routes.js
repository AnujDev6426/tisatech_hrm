const express = require('express');
const router = express.Router();
const followUpController = require('../../controllers/admincontroller/followup.controller')


// Follow-up Controller
router.post('/add-follow-up', followUpController.followUpAdd);
router.post('/view-list-followup', followUpController.getAllFollowUpList);
router.post('/send-message', followUpController.sendMessage);
router.post('/details-FollowUp', followUpController.getOneFollowUpDetails)
router.post('/follow-up-status', followUpController.statusUpdateFollowUp);
router.post('/follow-up-import-excel', followUpController.importExcel);

module.exports = router
