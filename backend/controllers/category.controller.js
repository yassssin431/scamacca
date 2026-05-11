const { Category } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

// CREATE
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_CATEGORY",
      entity: "Category",
      details: `Created category ${category.name}`,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// READ ONE
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await category.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_CATEGORY",
      entity: "Category",
      details: `Updated category ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    await category.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_CATEGORY",
      entity: "Category",
      details: `Deleted category ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
