const { Employee } = require("../models");
const { sendSuccess, sendError } = require("../utils/response");

/* CREATE EMPLOYEE */
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    return sendSuccess(
      res,
      "Employee created successfully",
      employee,
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ALL EMPLOYEES */
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();

    return sendSuccess(
      res,
      "Employees retrieved successfully",
      employees
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET EMPLOYEE BY ID */
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return sendError(res, "Employee not found", 404);
    }

    return sendSuccess(
      res,
      "Employee retrieved successfully",
      employee
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* UPDATE EMPLOYEE */
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return sendError(res, "Employee not found", 404);
    }

    await employee.update(req.body);

    return sendSuccess(
      res,
      "Employee updated successfully",
      employee
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* DELETE EMPLOYEE */
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return sendError(res, "Employee not found", 404);
    }

    await employee.destroy();

    return sendSuccess(
      res,
      "Employee deleted successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};