const { Payment, Invoice } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

/* CREATE PAYMENT */
exports.createPayment = async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    const invoice = await Invoice.findByPk(payment.InvoiceId, {
      include: Payment,
    });

    if (invoice) {
      const totalPaid = invoice.Payments.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      if (totalPaid >= Number(invoice.amount || 0)) {
        await invoice.update({ status: "Paid" });
      }
    }

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_PAYMENT",
      entity: "Payment",
      details: `Created payment ID ${payment.id} for invoice ${payment.InvoiceId}`,
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/* GET ALL PAYMENTS */
exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      include: Invoice,
    });

    res.json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE PAYMENT */
exports.deletePayment = async (req, res, next) => {
  try {
    const deleted = await Payment.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      throw new AppError("Payment not found", 404);
    }

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_PAYMENT",
      entity: "Payment",
      details: `Deleted payment ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
