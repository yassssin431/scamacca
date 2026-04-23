const Joi = require("joi");

const createDevisSchema = Joi.object({
  reference: Joi.string().max(100).allow("", null).optional(),

  amount: Joi.number().positive().required(),

  status: Joi.string()
    .valid("Pending", "Accepted", "Rejected", "Expired", "Sent")
    .required(),

  issue_date: Joi.date().required(),

  validity_date: Joi.date().min(Joi.ref("issue_date")).optional().messages({
    "date.min": "validity_date must be greater than or equal to issue_date",
  }),

  ClientId: Joi.number().integer().positive().required(),

  ProjectId: Joi.number().integer().positive().required(),
});

const updateDevisSchema = Joi.object({
  reference: Joi.string().max(100).allow("", null).optional(),

  amount: Joi.number().positive().optional(),

  status: Joi.string()
    .valid("Pending", "Accepted", "Rejected", "Expired", "Sent")
    .optional(),

  issue_date: Joi.date().optional(),

  validity_date: Joi.date().optional(),

  ClientId: Joi.number().integer().positive().optional(),

  ProjectId: Joi.number().integer().positive().optional(),
});

module.exports = {
  createDevisSchema,
  updateDevisSchema,
};