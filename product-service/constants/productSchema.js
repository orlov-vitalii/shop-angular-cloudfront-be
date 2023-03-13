const Joi = require('joi');

module.exports.productSchema = Joi.object().keys({
    title: Joi.string().required(),
    count: Joi.number().required(),
    price: Joi.number().required(),
    description: Joi.string(),
    imgLink: Joi.string(),
})