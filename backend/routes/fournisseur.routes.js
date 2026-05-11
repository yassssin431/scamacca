const express = require("express");
const router = express.Router();

const fournisseurController = require("../controllers/fournisseur.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createFournisseurSchema,
  updateFournisseurSchema,
} = require("../validations/fournisseur.validation");

// CREATE → Admin + Finance
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  validate(createFournisseurSchema),
  fournisseurController.createFournisseur
);

// GET ALL → Admin + Finance
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  fournisseurController.getFournisseurs
);

// GET ONE → Admin + Finance
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  fournisseurController.getFournisseurById
);

// UPDATE → Admin + Finance
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FINANCE),
  validate(updateFournisseurSchema),
  fournisseurController.updateFournisseur
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  fournisseurController.deleteFournisseur
);

module.exports = router;