// controllers/budget.controller.js
const { Budget } = require("../models");

// CREATE
exports.createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    return res.status(201).json(budget);
  } catch (error) {
    return res.status(500).json({ message: "Error creating budget", error: error.message });
  }
};

// READ ALL
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll();
    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching budgets", error: error.message });
  }
};

// READ ONE
exports.getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findByPk(id);

    if (!budget) return res.status(404).json({ message: "Budget not found" });
    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching budget", error: error.message });
  }
};

// UPDATE
exports.updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findByPk(id);

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    await budget.update(req.body);
    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({ message: "Error updating budget", error: error.message });
  }
};

// DELETE
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findByPk(id);

    if (!budget) return res.status(404).json({ message: "Budget not found" });

    await budget.destroy();
    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting budget", error: error.message });
  }
};