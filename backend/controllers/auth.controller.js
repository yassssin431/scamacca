const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* ================= REGISTER ================= */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, roleId } = req.body;

    if (!password || password.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      RoleId: roleId,
    });

    const { password: _, ...safeUser } = user.toJSON();

    // ✅ LOG REGISTER
    await logActivity({
      userId: user.id, // nouvel utilisateur créé
      action: "REGISTER",
      entity: "User",
      details: `User ${user.email} registered`,
    });

    res.status(201).json({
      success: true,
      message: "User created",
      user: safeUser,
    });
  } catch (error) {
    next(error); // passe au middleware central
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: Role,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.RoleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ LOG LOGIN
    await logActivity({
      userId: user.id,
      action: "LOGIN",
      entity: "User",
      details: `User ${user.email} logged in`,
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
