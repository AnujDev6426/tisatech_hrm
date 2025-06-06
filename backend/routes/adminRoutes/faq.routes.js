const express = require('express');
const router = express.Router();
const FaqController = require('../../controllers/admincontroller/faq.controller');


//FaqController
router.post('/add-faq', FaqController.FAQAdd);
router.post('/view-faq', FaqController.getAllFAQList);
router.post('/delete-faq', FaqController.DeletedFAQ);
router.post('/get-faqdetails', FaqController.getOneFAQDetails);
// router.post('/get-employeedetails',FaqController.getOneEmployeeDetails);

module.exports = router
