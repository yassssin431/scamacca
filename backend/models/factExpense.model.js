const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FactExpense = sequelize.define(
  "FactExpense",
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

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fournisseur_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,

    },
  },
  {
    indexes: [

      { fields: ["time_id"] },
      { fields: ["project_id"] },
      { fields: ["category_id"] },
    ],
  }
);

module.exports = FactExpense;

