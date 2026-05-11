const { Expense, Category, Project, Fournisseur } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* CREATE EXPENSE */
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_EXPENSE",
      entity: "Expense",
      details: `Amount: ${expense.amount}`,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ALL EXPENSES */
exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({
      include: [Category, Project, Fournisseur],
    });

    res.json({
      success: true,
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ONE EXPENSE */
exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [Category, Project, Fournisseur],
    });

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    res.json({
      success: true,
      message: "Expense retrieved successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE EXPENSE */
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    await expense.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_EXPENSE",
      entity: "Expense",
      details: `Updated expense ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE EXPENSE */
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    await expense.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_EXPENSE",
      entity: "Expense",
      details: `Deleted expense ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
