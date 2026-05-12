const { Devis, Invoice, Client, Project } = require("../models");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/AppError"); // 🔥 nouvelle classe d'erreurs

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

// CREATE
exports.createDevis = async (req, res, next) => {
  try {
    const devis = await Devis.create(req.body);

    // ✅ LOG CREATE
    await logActivity({
      userId: req.user.id,
      action: "CREATE_DEVIS",
      entity: "Devis",
      details: `Created devis ID ${devis.id}`,
    });

    res.status(201).json({
      success: true,
      message: "Devis created successfully",
      data: devis,
    });
  } catch (error) {
    next(error);
  }
};

// READ ALL
exports.getDevisList = async (req, res, next) => {
  try {
    const devisList = await Devis.findAll({
      include: [Client, Project, Invoice],
      order: [["issue_date", "DESC"]],
    });
    res.json({
      success: true,
      message: "Devis list retrieved successfully",
      data: devisList,
    });
  } catch (error) {
    next(error);
  }
};

// READ ONE
exports.getDevisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id, {
      include: [Client, Project, Invoice],
    });

    if (!devis) {
      throw new AppError("Devis not found", 404);
    }

    res.json({
      success: true,
      message: "Devis retrieved successfully",
      data: devis,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateDevis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id);

    if (!devis) {
      throw new AppError("Devis not found", 404);
    }

    await devis.update(req.body);

    // ✅ LOG UPDATE
    await logActivity({
      userId: req.user.id,
      action: "UPDATE_DEVIS",
      entity: "Devis",
      details: `Updated devis ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Devis updated successfully",
      data: devis,
    });
  } catch (error) {
    next(error);
  }
};

exports.convertDevisToInvoice = async (req, res, next) => {
  const transaction = await Devis.sequelize.transaction();

  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id, {
      transaction,
      lock: true,
    });

    if (!devis) {
      throw new AppError("Devis not found", 404);
    }

    if (["Rejected", "Expired"].includes(devis.status)) {
      throw new AppError("Only active or accepted devis can be converted", 400);
    }

    const existingInvoice = await Invoice.findOne({
      where: { DevisId: devis.id },
      transaction,
    });

    if (existingInvoice) {
      await transaction.commit();
      return res.json({
        success: true,
        message: "Devis already converted to invoice",
        data: existingInvoice,
      });
    }

    const issueDate = req.body.issue_date ? new Date(req.body.issue_date) : new Date();
    const invoice = await Invoice.create(
      {
        reference: req.body.reference || `INV-${Date.now()}`,
        amount: req.body.amount || devis.amount,
        status: "Pending",
        issue_date: issueDate,
        due_date: req.body.due_date ? new Date(req.body.due_date) : addDays(issueDate, 30),
        ClientId: devis.ClientId,
        ProjectId: devis.ProjectId,
        DevisId: devis.id,
      },
      { transaction }
    );

    if (devis.status !== "Accepted") {
      await devis.update({ status: "Accepted" }, { transaction });
    }

    await logActivity({
      userId: req.user.id,
      action: "CONVERT_DEVIS_TO_INVOICE",
      entity: "Devis",
      details: `Converted devis ${devis.reference || devis.id} to invoice ${invoice.reference || invoice.id}`,
    });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Devis converted to invoice successfully",
      data: invoice,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// DELETE
exports.deleteDevis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const devis = await Devis.findByPk(id);

    if (!devis) {
      throw new AppError("Devis not found", 404);
    }

    await devis.destroy();

    // ✅ LOG DELETE
    await logActivity({
      userId: req.user.id,
      action: "DELETE_DEVIS",
      entity: "Devis",
      details: `Deleted devis ID ${req.params.id}`,
    });

    res.json({
      success: true,
      message: "Devis deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
