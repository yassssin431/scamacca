const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FactSalary = sequelize.define(
  "FactSalary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    time_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount_paid: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    indexes: [
      { fields: ["time_id"] },
      { fields: ["employee_id"] },
    ],
  }
);

module.exports = FactSalary;
