const { User } = require("../models");
const { sendSuccess, sendError } = require("../utils/response");

/* GET ALL USERS */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return sendSuccess(res, "Users retrieved successfully", users);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ONE USER */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, "User retrieved successfully", user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* CREATE USER */
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return sendSuccess(res, "User created successfully", user, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* UPDATE USER */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    await user.update(req.body);
    return sendSuccess(res, "User updated successfully", user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* DELETE USER */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, "User not found", 404);
    await user.destroy();
    return sendSuccess(res, "User deleted successfully");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};