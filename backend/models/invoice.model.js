const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    reference: { type: DataTypes.STRING },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.01 },
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },

    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    due_date: { type: DataTypes.DATE },

    DevisId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ["issue_date"] },
      { fields: ["status"] },
      { fields: ["ProjectId"] },
      { fields: ["ClientId"] },
      { fields: ["DevisId"] },
    ],
  }
);

module.exports = Invoice;


