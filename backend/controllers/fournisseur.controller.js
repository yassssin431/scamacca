// controllers/fournisseur.controller.js
const { Fournisseur } = require("../models");

// CREATE
exports.createFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.create(req.body);
    return res.status(201).json(fournisseur);
  } catch (error) {
    return res.status(500).json({ message: "Error creating fournisseur", error: error.message });
  }
};

// READ ALL
exports.getFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.findAll();
    return res.status(200).json(fournisseurs);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching fournisseurs", error: error.message });
  }
};

// READ ONE
exports.getFournisseurById = async (req, res) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) return res.status(404).json({ message: "Fournisseur not found" });
    return res.status(200).json(fournisseur);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching fournisseur", error: error.message });
  }
};

// UPDATE
exports.updateFournisseur = async (req, res) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) return res.status(404).json({ message: "Fournisseur not found" });

    await fournisseur.update(req.body);
    return res.status(200).json(fournisseur);
  } catch (error) {
    return res.status(500).json({ message: "Error updating fournisseur", error: error.message });
  }
};

// DELETE
exports.deleteFournisseur = async (req, res) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) return res.status(404).json({ message: "Fournisseur not found" });

    await fournisseur.destroy();
    return res.status(200).json({ message: "Fournisseur deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting fournisseur", error: error.message });
  }
};