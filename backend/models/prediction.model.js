const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Prediction = sequelize.define("Prediction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
  },
  predicted_value: {
    type: DataTypes.FLOAT,
  },
  prediction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

module.exports = Prediction;
