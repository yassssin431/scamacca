const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const validate = require("../middleware/validate.middleware");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../validations/employee.validation");

// CREATE
router.post(
  "/",
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

// GET ALL
router.get("/", employeeController.getAllEmployees);

// GET ONE
router.get("/:id", employeeController.getEmployeeById);

// UPDATE
router.put(
  "/:id",
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

// DELETE
router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;