const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expense = sequelize.define(
  "Expense",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.01 },
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    description: { type: DataTypes.TEXT },

    reference: { type: DataTypes.STRING },
  },
  {
    indexes: [
      { fields: ["date"] },
      { fields: ["ProjectId"] },
      { fields: ["CategoryId"] },
    ],
  }
);

module.exports = Expense;

