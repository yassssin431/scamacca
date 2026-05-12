const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createPaymentSchema,
  updatePaymentSchema,
} = require("../validations/payment.validation");

// CREATE → Finance only
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  validate(createPaymentSchema),
  paymentController.createPayment
);

// GET ALL → Finance only
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE),
  paymentController.getAllPayments
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.FINANCE),
  paymentController.deletePayment
);

module.exports = router;
