const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expense.controller");
const validate = require("../middleware/validate.middleware");
const {
  createExpenseSchema,
  updateExpenseSchema,
} = require("../validations/expense.validation");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(createExpenseSchema),
  expenseController.createExpense
);

router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  expenseController.getAllExpenses
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  expenseController.getExpenseById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(updateExpenseSchema),
  expenseController.updateExpense
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  expenseController.deleteExpense
);

module.exports = router;
