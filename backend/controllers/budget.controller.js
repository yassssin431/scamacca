const { Budget, Project } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

// CREATE
exports.createBudget = async (req, res, next) => {
  try {
    const budget = await Budget.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_BUDGET",
      entity: "Budget",
      details: `Created budget ID ${budget.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      include: Project,
      order: [["start_date", "DESC"]],
    });
    res.json({
      success: true,
      message: "Budgets retrieved successfully",
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

// READ ONE
exports.getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id, {
      include: Project,
    });
    if (!budget) {
      throw new AppError("Budget not found", 404);
    }

    res.json({
      success: true,
      message: "Budget retrieved successfully",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);

    if (!budget) {
      throw new AppError("Budget not found", 404);
    }

    await budget.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_BUDGET",
      entity: "Budget",
      details: `Updated budget ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Budget updated successfully",
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);

    if (!budget) {
      throw new AppError("Budget not found", 404);
    }

    await budget.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_BUDGET",
      entity: "Budget",
      details: `Deleted budget ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
