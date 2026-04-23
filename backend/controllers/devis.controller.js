// controllers/devis.controller.js
const { Devis } = require("../models");

// CREATE
exports.createDevis = async (req, res) => {
  try {
    const devis = await Devis.create(req.body);
    return res.status(201).json(devis);
  } catch (error) {
    return res.status(500).json({ message: "Error creating devis", error: error.message });
  }
};

// READ ALL
exports.getDevisList = async (req, res) => {
  try {
    const devisList = await Devis.findAll();
    return res.status(200).json(devisList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching devis", error: error.message });
  }
};

// READ ONE
exports.getDevisById = async (req, res) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id);

    if (!devis) return res.status(404).json({ message: "Devis not found" });
    return res.status(200).json(devis);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching devis", error: error.message });
  }
};

// UPDATE
exports.updateDevis = async (req, res) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id);

    if (!devis) return res.status(404).json({ message: "Devis not found" });

    await devis.update(req.body);
    return res.status(200).json(devis);
  } catch (error) {
    return res.status(500).json({ message: "Error updating devis", error: error.message });
  }
};

// DELETE
exports.deleteDevis = async (req, res) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id);

    if (!devis) return res.status(404).json({ message: "Devis not found" });

    await devis.destroy();
    return res.status(200).json({ message: "Devis deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting devis", error: error.message });
  }
};