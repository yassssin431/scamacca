const { Client } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* CREATE CLIENT */
exports.createClient = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_CLIENT",
      entity: "Client",
      details: `Created client ${client.name || client.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ALL CLIENTS */
exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.findAll();

    res.json({
      success: true,
      message: "Clients retrieved successfully",
      data: clients,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ONE CLIENT */
exports.getClientById = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    res.json({
      success: true,
      message: "Client retrieved successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE CLIENT */
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    await client.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_CLIENT",
      entity: "Client",
      details: `Updated client ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE CLIENT */
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      throw new AppError("Client not found", 404);
    }

    await client.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_CLIENT",
      entity: "Client",
      details: `Deleted client ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

