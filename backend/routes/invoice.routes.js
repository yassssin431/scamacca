const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoice.controller");
const validate = require("../middleware/validate.middleware");
const {
  createInvoiceSchema,
  updateInvoiceSchema,
} = require("../validations/invoice.validation");

// CREATE
router.post(
  "/",
  validate(createInvoiceSchema),
  invoiceController.createInvoice
);

// GET ALL
router.get("/", invoiceController.getAllInvoices);

// GET ONE
router.get("/:id", invoiceController.getInvoiceById);

// UPDATE
router.put(
  "/:id",
  validate(updateInvoiceSchema),
  invoiceController.updateInvoice
);

// DELETE
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;
