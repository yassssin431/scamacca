const express = require("express");
const router = express.Router();

const salaryController = require("../controllers/salary.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createSalarySchema,
  updateSalarySchema,
} = require("../validations/salary.validation");

// CREATE → Finance only
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  validate(createSalarySchema),
  salaryController.createSalary
);

// GET ALL → Finance only
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  salaryController.getSalaries
);

// GET ONE → Finance only
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  salaryController.getSalaryById
);

// UPDATE → Finance only
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  validate(updateSalarySchema),
  salaryController.updateSalary
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  salaryController.deleteSalary
);

module.exports = router;