const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "Active" },
  total_value: { 
  type: DataTypes.FLOAT, 
  allowNull: false,
  validate: { min: 0.01 }
},
});

module.exports = Project;
