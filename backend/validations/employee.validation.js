const Joi = require("joi");

const createEmployeeSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required(),

  last_name: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().required(),

  phone: Joi.string().optional(),

  position: Joi.string().required(),

  team: Joi.string().min(2).max(100).required(),

  department: Joi.string().min(2).max(100).required(),

  base_salary: Joi.number().positive().required(),

  hire_date: Joi.date().required(),
});

const updateEmployeeSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).optional(),

  last_name: Joi.string().min(2).max(100).optional(),

  email: Joi.string().email().optional(),

  phone: Joi.string().optional(),

  position: Joi.string().optional(),

  team: Joi.string().min(2).max(100).optional(),

  department: Joi.string().min(2).max(100).optional(),

  base_salary: Joi.number().positive().optional(),

  hire_date: Joi.date().optional(),
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
};
