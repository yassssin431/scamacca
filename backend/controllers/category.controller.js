const { Category } = require("../models");

/* CREATE CATEGORY */
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL CATEGORIES */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET CATEGORY BY ID */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) return res.status(404).json({ message: "Not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* UPDATE CATEGORY */
exports.updateCategory = async (req, res) => {
  try {
    await Category.update(req.body, {
      where: { id: req.params.id },
    });

    res.json({ message: "Category updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE CATEGORY */
exports.deleteCategory = async (req, res) => {
  try {
    await Category.destroy({
      where: { id: req.params.id },
    });

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
