const express = require("express");
const router = express.Router();

const devisController = require("../controllers/devis.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createDevisSchema,
  updateDevisSchema,
} = require("../validations/devis.validation");

// CREATE → Admin + Manager
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(createDevisSchema),
  devisController.createDevis
);

// GET ALL → Admin + Manager
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  devisController.getDevisList
);

// GET ONE → Admin + Manager
router.post(
  "/:id/convert-to-invoice",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  devisController.convertDevisToInvoice
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  devisController.getDevisById
);

// UPDATE → Admin + Manager
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateDevisSchema),
  devisController.updateDevis
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  devisController.deleteDevis
);

module.exports = router;
