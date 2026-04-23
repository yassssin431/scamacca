const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expense.controller");
const validate = require("../middleware/validate.middleware");
const {
  createExpenseSchema,
  updateExpenseSchema,
} = require("../validations/expense.validation");

// CREATE
router.post(
  "/",
  validate(createExpenseSchema),
  expenseController.createExpense
);

// GET ALL
router.get("/", expenseController.getAllExpenses);

// GET ONE
router.get("/:id", expenseController.getExpenseById);

// UPDATE
router.put(
  "/:id",
  validate(updateExpenseSchema),
  expenseController.updateExpense
);

// DELETE
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
