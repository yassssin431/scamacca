const Joi = require("joi");

const createSalarySchema = Joi.object({
  month: Joi.string()
    .valid(
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    )
    .required(),

  year: Joi.number().integer().min(2000).max(2100).required(),

  amount_paid: Joi.number().positive().required(),

  payment_date: Joi.date().required(),

  EmployeeId: Joi.number().integer().positive().required(),
});

const updateSalarySchema = Joi.object({
  month: Joi.string()
    .valid(
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    )
    .optional(),

  year: Joi.number().integer().min(2000).max(2100).optional(),

  amount_paid: Joi.number().positive().optional(),

  payment_date: Joi.date().optional(),

  EmployeeId: Joi.number().integer().positive().optional(),
});

module.exports = {
  createSalarySchema,
  updateSalarySchema,
};

