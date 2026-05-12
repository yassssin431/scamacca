const express = require("express");
const router = express.Router();

const clientController = require("../controllers/client.controller");
const validate = require("../middleware/validate.middleware");
const {
  createClientSchema,
  updateClientSchema,
} = require("../validations/client.validation");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

router.post(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(createClientSchema),
  clientController.createClient
);

router.get(
  "/",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE),
  clientController.getAllClients
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE),
  clientController.getClientById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validate(updateClientSchema),
  clientController.updateClient
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  clientController.deleteClient
);

module.exports = router;
