const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FactRevenue = sequelize.define(
  "FactRevenue",
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

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    payment_status: {
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [
      { fields: ["time_id"] },
      { fields: ["client_id"] },
      { fields: ["project_id"] },
    ],
  }
);

module.exports = FactRevenue;
