const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const schema = require('../validatons/auth.validation');
const validate = require('../utils/validator.util');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.post('/check-forgot-email-mobile', validate(schema.forgot_password_email_verify), ErrorHandler(AuthController.forgot_password_veriyemailMobile));

router.post('/register', validate(schema.register), ErrorHandler(AuthController.register));
router.post('/login', validate(schema.login), ErrorHandler(AuthController.login));
router.get('/user', AuthGuard, ErrorHandler(AuthController.getUser));
router.put('/updatepofile', AuthGuard, uploadMiddleware, (AuthController.Updateprofile));
router.put('/changepassword', AuthGuard, ErrorHandler(AuthController.changePasssword));

router.get('/logout', AuthGuard, ErrorHandler(AuthController.logout));
router.post('/verify-account', validate(schema.verify_account), ErrorHandler(AuthController.verify_account_signup));
router.post('/reset-password', validate(schema.reset_password), ErrorHandler(AuthController.reset_passowrds));


module.exports = router;
