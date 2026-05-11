const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Alert = sequelize.define("Alert", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING }
});

module.exports = Alert;
