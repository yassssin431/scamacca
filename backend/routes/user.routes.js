const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

// CREATE USER → Admin only
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  userController.createUser
);

// GET ALL USERS → Admin only
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  userController.getAllUsers
);

// GET ONE USER → Admin only
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  userController.getUserById
);

// UPDATE USER → Admin only
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  userController.updateUser
);

// DELETE USER → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  userController.deleteUser
);

module.exports = router;
