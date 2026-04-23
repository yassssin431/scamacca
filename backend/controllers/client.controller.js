const { Client } = require("../models");
const { sendSuccess, sendError } = require("../utils/response");

/* CREATE CLIENT */
exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);

    return sendSuccess(
      res,
      "Client created successfully",
      client,
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ALL CLIENTS */
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();

    return sendSuccess(
      res,
      "Clients retrieved successfully",
      clients
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ONE CLIENT */
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return sendError(res, "Client not found", 404);
    }

    return sendSuccess(
      res,
      "Client retrieved successfully",
      client
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* UPDATE CLIENT */
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return sendError(res, "Client not found", 404);
    }

    await client.update(req.body);

    return sendSuccess(
      res,
      "Client updated successfully",
      client
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* DELETE CLIENT */
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return sendError(res, "Client not found", 404);
    }

    await client.destroy();

    return sendSuccess(
      res,
      "Client deleted successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};