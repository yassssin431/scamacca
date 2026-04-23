const Joi = require("joi");

const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),

  payment_date: Joi.date().required(),

  method: Joi.string()
    .valid("Cash", "Bank Transfer", "Card", "Check", "Mobile Payment")
    .required(),

  reference: Joi.string().max(100).allow("", null).optional(),

  InvoiceId: Joi.number().integer().positive().required(),
});

const updatePaymentSchema = Joi.object({
  amount: Joi.number().positive().optional(),

  payment_date: Joi.date().optional(),

  method: Joi.string()
    .valid("Cash", "Bank Transfer", "Card", "Check", "Mobile Payment")
    .optional(),

  reference: Joi.string().max(100).allow("", null).optional(),

  InvoiceId: Joi.number().integer().positive().optional(),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};