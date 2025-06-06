const Joi = require('joi');
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);

const validatePassword = (value) => {  
    if(!passwordRegex.test(String(value))) { 
        throw new Error('Password should contains a lowercase, a uppercase character and a digit.')
    }
} 
 
module.exports = {
    register: Joi.object().keys({
        name: Joi.string().max(255).required().messages({
            'string.base': 'Name should be a type of text',
            'string.empty': 'Name is required',
            'string.max': 'Name should have a maximum length of 255 characters',
            'any.required': 'Name is a required field'
        }),
        email: Joi.string().email().max(255).required().messages({
            'string.base': 'Email should be a type of text',
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email is required',
            'string.max': 'Email should have a maximum length of 255 characters',
            'any.required': 'Email is a required field'
        }),
        mobile: Joi.string().max(20).optional().messages({
            'string.base': 'Mobile should be a type of text',
            'string.max': 'Mobile should have a maximum length of 20 characters'
        }),
        source: Joi.string().optional().messages({
            'string.base': 'Source should be a type of text'
        }),
        password: Joi.string().min(8).max(16).required().external(validatePassword).messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password is required',
            'string.min': 'Password should have a minimum length of 8 characters',
            'string.max': 'Password should have a maximum length of 16 characters',
            'any.required': 'Password is a required field'
        }),
        status: Joi.number().integer().min(0).max(3).default(0).messages({
            'number.base': 'Status should be a type of number',
            'number.min': 'Status should be at least 0',
            'number.max': 'Status should be at most 3'
        }),
        login_type: Joi.string().valid('gmail', 'facebook', 'web', 'mobile').required().messages({
            'string.base': 'Login type should be a type of text',
            'any.only': 'Login type must be one of gmail, facebook, web, or mobile',
            'any.required': 'Login type is a required field'
        }),
        role_Id: Joi.number().integer().valid(0, 1, 2, 3, 4).default(0).messages({
            'number.base': 'User role ID should be a type of number',
            'any.only': 'User role ID must be one of 0, 1, 2, 3, or 4',
            'any.required': 'User role ID is a required field'
        }),
        active_user_role_id: Joi.number().integer().default(0).messages({
            'number.base': 'Active user role ID should be a type of number'
        }),
        active_company_id: Joi.number().integer().optional().messages({
            'number.base': 'Active company ID should be a type of number'
        }),
        device_token: Joi.string().optional().messages({
            'string.base': 'Device token should be a type of text'
        }),
        remember_access: Joi.string().max(255).optional().messages({
            'string.base': 'Remember access should be a type of text',
            'string.max': 'Remember access should have a maximum length of 255 characters'
        }),
    }),
    
    login: Joi.object().keys({
        login_id: Joi.string().required(),
        login_type: Joi.string().valid('gmail', 'facebook', 'web', 'mobile'),
        source: Joi.string(),
        password: Joi.string().required(),
        type: Joi.string().required()

    }),
    forgot_password_email_verify: Joi.object().keys({
        login_id: Joi.string().required(),     
        type: Joi.string().required(),   
        source: Joi.string().required()    
    }),
    forgot_password_otp_verify: Joi.object().keys({
        login_id: Joi.string().required(),     
        otp: Joi.string().required(),   
        source: Joi.string().required()    
    }),
    reset_password: Joi.object().keys({        
        password: Joi.string().min(8).max(16).required().external(validatePassword),
        token:Joi.string()       
    }),
    verify_account: Joi.object().keys({
        token:Joi.string().required()       
    }),
    social_register: Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        others:Joi.string(),
        type:Joi.string()
    })
} 