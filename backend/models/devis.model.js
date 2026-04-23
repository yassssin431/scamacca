const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Devis = sequelize.define("Devis", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0.01 } },
  status: { type: DataTypes.STRING },
  issue_date: { type: DataTypes.DATE, allowNull: false },
  validity_date: { type: DataTypes.DATE },
});

module.exports = Devis;
