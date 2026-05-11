const express = require("express");
const router = express.Router();

const etlController = require("../controllers/etl.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

// ETL → Admin only (very important for jury)
router.post(
  "/revenue",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  etlController.runRevenueETL
);

router.post(
  "/expense",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  etlController.runExpenseETL
);

module.exports = router;