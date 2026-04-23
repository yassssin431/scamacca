const Joi = require("joi");

const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),

  description: Joi.string().optional(),

  start_date: Joi.date().optional(),

  end_date: Joi.date().optional(),

  status: Joi.string()
    .valid("Active", "Completed", "On Hold", "Cancelled")
    .optional(),

  total_value: Joi.number().positive().required(),

  ClientId: Joi.number().integer().required(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional(),

  description: Joi.string().optional(),

  start_date: Joi.date().optional(),

  end_date: Joi.date().optional(),

  status: Joi.string()
    .valid("Active", "Completed", "On Hold", "Cancelled")
    .optional(),

  total_value: Joi.number().positive().optional(),

  ClientId: Joi.number().integer().optional(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};