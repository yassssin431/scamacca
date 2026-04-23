const { Expense, Category, Project, Fournisseur } = require("../models");
const { sendSuccess, sendError } = require("../utils/response");

/* CREATE EXPENSE */
exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);

    return sendSuccess(
      res,
      "Expense created successfully",
      expense,
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ALL EXPENSES */
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [Category, Project, Fournisseur],
    });

    return sendSuccess(
      res,
      "Expenses retrieved successfully",
      expenses
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ONE EXPENSE */
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [Category, Project, Fournisseur],
    });

    if (!expense) {
      return sendError(res, "Expense not found", 404);
    }

    return sendSuccess(
      res,
      "Expense retrieved successfully",
      expense
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* UPDATE EXPENSE */
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return sendError(res, "Expense not found", 404);
    }

    await expense.update(req.body);

    return sendSuccess(
      res,
      "Expense updated successfully",
      expense
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* DELETE EXPENSE */
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return sendError(res, "Expense not found", 404);
    }

    await expense.destroy();

    return sendSuccess(
      res,
      "Expense deleted successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};