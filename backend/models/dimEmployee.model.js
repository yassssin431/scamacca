const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DimEmployee = sequelize.define("DimEmployee", {

  employee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  name: DataTypes.STRING,

  position: DataTypes.STRING,

});

module.exports = DimEmployee;