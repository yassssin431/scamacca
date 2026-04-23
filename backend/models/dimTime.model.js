const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DimTime = sequelize.define("DimTime", {

  time_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  date: DataTypes.DATE,

  day: DataTypes.INTEGER,

  month: DataTypes.INTEGER,

  month_name: DataTypes.STRING,

  quarter: DataTypes.INTEGER,

  year: DataTypes.INTEGER,

  fiscal_year: DataTypes.INTEGER,

  fiscal_quarter: DataTypes.INTEGER,

  is_weekend: DataTypes.BOOLEAN,

});

module.exports = DimTime;