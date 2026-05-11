const { Employee } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* CREATE EMPLOYEE */
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_EMPLOYEE",
      entity: "Employee",
      details: `Created employee ${employee.name || employee.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ALL EMPLOYEES */
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();

    res.json({
      success: true,
      message: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/* GET EMPLOYEE BY ID */
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    res.json({
      success: true,
      message: "Employee retrieved successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE EMPLOYEE */
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    await employee.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_EMPLOYEE",
      entity: "Employee",
      details: `Updated employee ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE EMPLOYEE */
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    await employee.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_EMPLOYEE",
      entity: "Employee",
      details: `Deleted employee ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
