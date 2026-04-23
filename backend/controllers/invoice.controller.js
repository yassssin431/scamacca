const { Invoice, Client, Project, Payment } = require("../models");
const { sendSuccess, sendError } = require("../utils/response");

/* CREATE INVOICE */
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);

    return sendSuccess(
      res,
      "Invoice created successfully",
      invoice,
      201
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ALL INVOICES */
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [Client, Project, Payment],
    });

    return sendSuccess(
      res,
      "Invoices retrieved successfully",
      invoices
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* GET ONE INVOICE */
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [Client, Project, Payment],
    });

    if (!invoice) {
      return sendError(res, "Invoice not found", 404);
    }

    return sendSuccess(
      res,
      "Invoice retrieved successfully",
      invoice
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* UPDATE INVOICE */
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return sendError(res, "Invoice not found", 404);
    }

    await invoice.update(req.body);

    return sendSuccess(
      res,
      "Invoice updated successfully",
      invoice
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/* DELETE INVOICE */
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return sendError(res, "Invoice not found", 404);
    }

    await invoice.destroy();

    return sendSuccess(
      res,
      "Invoice deleted successfully"
    );
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};