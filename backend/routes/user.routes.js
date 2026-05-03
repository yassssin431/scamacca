const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// CREATE USER
router.post("/", userController.createUser);

// GET ALL USERS
router.get("/", userController.getAllUsers);

// GET ONE USER
router.get("/:id", userController.getUserById);

// UPDATE USER
router.put("/:id", userController.updateUser);

// DELETE USER
router.delete("/:id", userController.deleteUser);

module.exports = router;