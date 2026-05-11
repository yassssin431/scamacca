const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const validate = require("../middleware/validate.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  createProjectSchema,
  updateProjectSchema,
} = require("../validations/project.validation");

// CREATE → Admin + Manager
router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(createProjectSchema),
  projectController.createProject
);

// GET ALL → Admin + Manager
router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  projectController.getAllProjects
);

// GET ONE → Admin + Manager
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  projectController.getProjectById
);

// UPDATE → Admin + Manager
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateProjectSchema),
  projectController.updateProject
);

// DELETE → Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  projectController.deleteProject
);

module.exports = router;