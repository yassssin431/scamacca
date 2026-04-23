const Joi = require("joi");

const createFournisseurSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().allow("", null).optional(),

  phone: Joi.string().max(30).allow("", null).optional(),

  address: Joi.string().max(255).allow("", null).optional(),

  contact_person: Joi.string().min(2).max(100).allow("", null).optional(),
});

const updateFournisseurSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),

  email: Joi.string().email().allow("", null).optional(),

  phone: Joi.string().max(30).allow("", null).optional(),

  address: Joi.string().max(255).allow("", null).optional(),

  contact_person: Joi.string().min(2).max(100).allow("", null).optional(),
});

module.exports = {
  createFournisseurSchema,
  updateFournisseurSchema,
};