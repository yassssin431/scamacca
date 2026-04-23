const express = require("express");
const router = express.Router();

const clientController = require("../controllers/client.controller");
const validate = require("../middleware/validate.middleware");
const {
  createClientSchema,
  updateClientSchema,
} = require("../validations/client.validation");

// CREATE CLIENT (with validation)
router.post(
  "/",
  validate(createClientSchema),
  clientController.createClient
);

// GET ALL CLIENTS
router.get("/", clientController.getAllClients);

// GET ONE CLIENT
router.get("/:id", clientController.getClientById);

// UPDATE CLIENT (with validation)
router.put(
  "/:id",
  validate(updateClientSchema),
  clientController.updateClient
);

// DELETE CLIENT
router.delete("/:id", clientController.deleteClient);

module.exports = router;