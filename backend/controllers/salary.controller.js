// controllers/salary.controller.js
const { Salary } = require("../models");

// CREATE
exports.createSalary = async (req, res) => {
  try {
    const salary = await Salary.create(req.body);
    return res.status(201).json(salary);
  } catch (error) {
    return res.status(500).json({ message: "Error creating salary", error: error.message });
  }
};

// READ ALL
exports.getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.findAll();
    return res.status(200).json(salaries);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching salaries", error: error.message });
  }
};

// READ ONE
exports.getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByPk(id);

    if (!salary) return res.status(404).json({ message: "Salary not found" });
    return res.status(200).json(salary);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching salary", error: error.message });
  }
};

// UPDATE
exports.updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByPk(id);

    if (!salary) return res.status(404).json({ message: "Salary not found" });

    await salary.update(req.body);
    return res.status(200).json(salary);
  } catch (error) {
    return res.status(500).json({ message: "Error updating salary", error: error.message });
  }
};

// DELETE
exports.deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByPk(id);

    if (!salary) return res.status(404).json({ message: "Salary not found" });

    await salary.destroy();
    return res.status(200).json({ message: "Salary deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting salary", error: error.message });
  }
};