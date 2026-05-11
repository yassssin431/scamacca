const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../validations/employee.validation");

// CREATE → Admin + Finance
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

// GET ALL → Admin + Finance
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  employeeController.getAllEmployees
);

// GET ONE → Admin + Finance
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  employeeController.getEmployeeById
);

// UPDATE → Admin + Finance
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  employeeController.deleteEmployee
);

module.exports = router;