const Joi = require("joi");

const createClientSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  email: Joi.string().email().optional(),

  phone: Joi.string().optional(),

  address: Joi.string().optional(),

  company: Joi.string().optional(),
});

const updateClientSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),

  email: Joi.string().email().optional(),

  phone: Joi.string().optional(),

  address: Joi.string().optional(),

  company: Joi.string().optional(),
});

module.exports = {
  createClientSchema,
  updateClientSchema,
};