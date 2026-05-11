const { Invoice, Client, Project, Payment } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* CREATE INVOICE */
exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_INVOICE",
      entity: "Invoice",
      details: `Created invoice ID ${invoice.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ALL INVOICES */
exports.getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.findAll({
      include: [Client, Project, Payment],
    });

    res.json({
      success: true,
      message: "Invoices retrieved successfully",
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ONE INVOICE */
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [Client, Project, Payment],
    });

    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    res.json({
      success: true,
      message: "Invoice retrieved successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE INVOICE */
exports.updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    await invoice.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_INVOICE",
      entity: "Invoice",
      details: `Updated invoice ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE INVOICE */
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      throw new AppError("Invoice not found", 404);
    }

    await invoice.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_INVOICE",
      entity: "Invoice",
      details: `Deleted invoice ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
