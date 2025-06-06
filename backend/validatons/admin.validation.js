const Joi = require('joi');

//to validate company detail
const validatecomapny = (data) => {
  const schema = Joi.object({
    company_id: Joi.number()
        .required()
        .messages({
            'any.required': 'Company ID is required.',
            'number.base': 'Company ID must be a number.'
        }),

        user_id: Joi.number()
        .required()
        .messages({
            'any.required': 'User ID is required.',
            'number.base': 'User ID must be a number.'
        }),

    });
    return schema.validate(data);
};

module.exports = {
  validatecomapny
} 