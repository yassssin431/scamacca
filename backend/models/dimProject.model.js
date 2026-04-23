const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DimProject = sequelize.define("DimProject", {

  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  name: DataTypes.STRING,

  status: DataTypes.STRING,

});

module.exports = DimProject;