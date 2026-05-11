const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

// REGISTER
router.post("/register", validate(registerSchema), authController.register);

// LOGIN
router.post("/login", validate(loginSchema), authController.login);

module.exports = router;