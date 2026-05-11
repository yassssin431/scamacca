const express = require("express");
const router = express.Router();

const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

router.get(
  "/summary",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE),
  getDashboardSummary
);

module.exports = router;
