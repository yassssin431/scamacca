const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validations/invoice.validation");

// CREATE → Admin + Finance
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(createInvoiceSchema),
  invoiceController.createInvoice
);

// GET ALL → Admin + Finance
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE),
  invoiceController.getAllInvoices
);

// GET ONE → Admin + Finance
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE),
  invoiceController.getInvoiceById
);

// UPDATE → Admin + Finance
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(updateInvoiceSchema),
  invoiceController.updateInvoice
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  invoiceController.deleteInvoice
);

module.exports = router;
