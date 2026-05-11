const express = require("express");
const router = express.Router();

const { ActivityLog } = require("../models");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

// Admin only
router.get("/", verifyToken, authorizeRoles(ROLES.ADMIN), async (req, res) => {
  const logs = await ActivityLog.findAll({
    order: [["timestamp", "DESC"]],
  });

  res.json(logs);
});

module.exports = router;