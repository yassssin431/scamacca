const Joi = require("joi");

const createBudgetSchema = Joi.object({
  amount: Joi.number().positive().required(),

  start_date: Joi.date().required(),

  end_date: Joi.date().min(Joi.ref("start_date")).required().messages({
    "date.min": "end_date must be greater than or equal to start_date",
  }),

  description: Joi.string().allow("", null).optional(),

  ProjectId: Joi.number().integer().positive().required(),
});

const updateBudgetSchema = Joi.object({
  amount: Joi.number().positive().optional(),

  start_date: Joi.date().optional(),

  end_date: Joi.date().optional(),

  description: Joi.string().allow("", null).optional(),

  ProjectId: Joi.number().integer().positive().optional(),
});

module.exports = {
  createBudgetSchema,
  updateBudgetSchema,
};