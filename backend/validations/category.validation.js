const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  description: Joi.string().allow("", null).optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),

  description: Joi.string().allow("", null).optional(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};

