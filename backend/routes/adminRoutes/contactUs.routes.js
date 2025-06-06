const express = require('express');
const router = express.Router();
const contactUsController = require('../../controllers/admincontroller/contact.controller')

// contact us controller
router.post('/get-contact-list', contactUsController.ContactUsGet);

module.exports = router

