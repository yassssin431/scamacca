const { Payment, Invoice } = require("../models");

/* CREATE PAYMENT */
exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL PAYMENTS */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: Invoice,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* DELETE PAYMENT */
exports.deletePayment = async (req, res) => {
  try {
    await Payment.destroy({
      where: { id: req.params.id },
    });

    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
