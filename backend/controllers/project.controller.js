const { Project, Client } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* CREATE PROJECT */
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_PROJECT",
      entity: "Project",
      details: `Created project ${project.name || project.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ALL PROJECTS */
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: Client,
    });

    res.json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/* GET PROJECT BY ID */
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: Client,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    res.json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE PROJECT */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    await project.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_PROJECT",
      entity: "Project",
      details: `Updated project ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE PROJECT */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    await project.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_PROJECT",
      entity: "Project",
      details: `Deleted project ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
