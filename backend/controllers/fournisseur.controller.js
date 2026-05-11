// controllers/fournisseur.controller.js
const { Fournisseur } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

// CREATE
exports.createFournisseur = async (req, res, next) => {
  try {
    const fournisseur = await Fournisseur.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_FOURNISSEUR",
      entity: "Fournisseur",
      details: `Created fournisseur ${fournisseur.name || fournisseur.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Fournisseur created successfully",
      data: fournisseur,
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL
exports.getFournisseurs = async (req, res, next) => {
  try {
    const fournisseurs = await Fournisseur.findAll();
    res.json({
      success: true,
      message: "Fournisseurs retrieved successfully",
      data: fournisseurs,
    });
  } catch (error) {
    next(error);
  }
};

// READ ONE
exports.getFournisseurById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) {
      throw new AppError("Fournisseur not found", 404);
    }

    res.json({
      success: true,
      message: "Fournisseur retrieved successfully",
      data: fournisseur,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateFournisseur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) {
      throw new AppError("Fournisseur not found", 404);
    }

    await fournisseur.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_FOURNISSEUR",
      entity: "Fournisseur",
      details: `Updated fournisseur ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Fournisseur updated successfully",
      data: fournisseur,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteFournisseur = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fournisseur = await Fournisseur.findByPk(id);

    if (!fournisseur) {
      throw new AppError("Fournisseur not found", 404);
    }

    await fournisseur.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_FOURNISSEUR",
      entity: "Fournisseur",
      details: `Deleted fournisseur ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Fournisseur deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

