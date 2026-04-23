const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const validate = require("../middleware/validate.middleware");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../validations/project.validation");

// CREATE
router.post(
  "/",
  validate(createProjectSchema),
  projectController.createProject
);

// GET ALL
router.get("/", projectController.getAllProjects);

// GET ONE
router.get("/:id", projectController.getProjectById);

// UPDATE
router.put(
  "/:id",
  validate(updateProjectSchema),
  projectController.updateProject
);

// DELETE
router.delete("/:id", projectController.deleteProject);

module.exports = router;