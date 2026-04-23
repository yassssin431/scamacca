const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DimCategory = sequelize.define("DimCategory", {

  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  name: DataTypes.STRING,

});

module.exports = DimCategory;