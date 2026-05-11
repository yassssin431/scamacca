// controllers/salary.controller.js
const { Salary } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

// CREATE
exports.createSalary = async (req, res, next) => {
  try {
    const salary = await Salary.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_SALARY",
      entity: "Salary",
      details: `Created salary ID ${salary.id} for employee ${salary.employeeId}`,
    });

    res.status(201).json({
      success: true,
      message: "Salary created successfully",
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL
exports.getSalaries = async (req, res, next) => {
  try {
    const salaries = await Salary.findAll();
    res.json({
      success: true,
      message: "Salaries retrieved successfully",
      data: salaries,
    });
  } catch (error) {
    next(error);
  }
};

// READ ONE
exports.getSalaryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByPk(id);

    if (!salary) {
      throw new AppError("Salary not found", 404);
    }

    res.json({
      success: true,
      message: "Salary retrieved successfully",
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByPk(id);

    if (!salary) {
      throw new AppError("Salary not found", 404);
    }

    await salary.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_SALARY",
      entity: "Salary",
      details: `Updated salary ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Salary updated successfully",
      data: salary,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteSalary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByPk(id);

    if (!salary) {
      throw new AppError("Salary not found", 404);
    }

    await salary.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_SALARY",
      entity: "Salary",
      details: `Deleted salary ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Salary deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
