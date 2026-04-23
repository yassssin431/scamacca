const { Project, Client } = require("../models");
const { sendSuccess, sendError } = require("../utils/response");

/* CREATE PROJECT */
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);

    return sendSuccess(
      res,
      "Project created successfully",
      project,
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ALL PROJECTS */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: Client,
    });

    return sendSuccess(
      res,
      "Projects retrieved successfully",
      projects
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET PROJECT BY ID */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: Client,
    });

    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    return sendSuccess(
      res,
      "Project retrieved successfully",
      project
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* UPDATE PROJECT */
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    await project.update(req.body);

    return sendSuccess(
      res,
      "Project updated successfully",
      project
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* DELETE PROJECT */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return sendError(res, "Project not found", 404);
    }

    await project.destroy();

    return sendSuccess(
      res,
      "Project deleted successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};