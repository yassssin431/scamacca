const bcrypt = require("bcryptjs");
const { User } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* GET ALL USERS */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const safeUsers = users.map((user) => {
      const { password: _, ...safeUser } = user.toJSON();
      return safeUser;
    });

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: safeUsers,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ONE USER */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const { password: _, ...safeUser } = user.toJSON();

    res.json({
      success: true,
      message: "User retrieved successfully",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* CREATE USER */
exports.createUser = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    if (!payload.password || payload.password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    payload.password = await bcrypt.hash(payload.password, 10);

    const user = await User.create(payload);
    const { password: _, ...safeUser } = user.toJSON();

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_USER",
      entity: "User",
      details: `Created user ${user.email}`,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE USER */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const payload = { ...req.body };

    if (payload.password) {
      if (payload.password.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
      }

      payload.password = await bcrypt.hash(payload.password, 10);
    } else {
      delete payload.password;
    }

    await user.update(payload);
    const { password: _, ...safeUser } = user.toJSON();

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_USER",
      entity: "User",
      details: `Updated user ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE USER */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await user.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_USER",
      entity: "User",
      details: `Deleted user ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
