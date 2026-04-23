const Joi = require("joi");

const createExpenseSchema = Joi.object({
  amount: Joi.number().positive().required(),

  date: Joi.date().required(),

  description: Joi.string().optional(),

  reference: Joi.string().optional(),

  CategoryId: Joi.number().integer().required(),

  ProjectId: Joi.number().integer().required(),

  FournisseurId: Joi.number().integer().optional(),
});

const updateExpenseSchema = Joi.object({
  amount: Joi.number().positive().optional(),

  date: Joi.date().optional(),

  description: Joi.string().optional(),

  reference: Joi.string().optional(),

  CategoryId: Joi.number().integer().optional(),

  ProjectId: Joi.number().integer().optional(),

  FournisseurId: Joi.number().integer().optional(),
});

module.exports = {
  createExpenseSchema,
  updateExpenseSchema,
};