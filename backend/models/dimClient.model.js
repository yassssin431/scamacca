const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DimClient = sequelize.define("DimClient", {

  client_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  name: DataTypes.STRING,

  company: DataTypes.STRING,

});

module.exports = DimClient;