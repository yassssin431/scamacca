const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const validate = require("../middleware/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validations/category.validation");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  categoryController.getCategories   // ✅ correction ici
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  categoryController.getCategoryById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  categoryController.deleteCategory
);

module.exports = router;

