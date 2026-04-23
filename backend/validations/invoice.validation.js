const Joi = require("joi");

const createInvoiceSchema = Joi.object({
  reference: Joi.string().optional(),

  amount: Joi.number().positive().required(),

  status: Joi.string()
    .valid("Pending", "Paid", "Overdue")
    .required(),

  issue_date: Joi.date().required(),

  due_date: Joi.date().optional(),

  ClientId: Joi.number().integer().required(),

  ProjectId: Joi.number().integer().required(),
});

const updateInvoiceSchema = Joi.object({
  reference: Joi.string().optional(),

  amount: Joi.number().positive().optional(),

  status: Joi.string()
    .valid("Pending", "Paid", "Overdue")
    .optional(),

  issue_date: Joi.date().optional(),

  due_date: Joi.date().optional(),

  ClientId: Joi.number().integer().optional(),

  ProjectId: Joi.number().integer().optional(),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
};