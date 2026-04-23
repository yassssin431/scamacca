const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.01 },
    },

    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    reference: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      { fields: ["payment_date"] },
      { fields: ["InvoiceId"] },
      { fields: ["method"] },
    ],
  }
);

module.exports = Payment;
