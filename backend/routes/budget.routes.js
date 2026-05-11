const router = require("express").Router();

const budgetController = require("../controllers/budget.controller");
const validate = require("../middleware/validate.middleware");
const {
  createBudgetSchema,
  updateBudgetSchema,
} = require("../validations/budget.validation");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

// CREATE
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(createBudgetSchema),
  budgetController.createBudget
);

// GET ALL
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  budgetController.getBudgets
);

// GET ONE
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  budgetController.getBudgetById
);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(updateBudgetSchema),
  budgetController.updateBudget
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  budgetController.deleteBudget
);

module.exports = router;