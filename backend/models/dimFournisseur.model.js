const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DimFournisseur = sequelize.define("DimFournisseur", {

  fournisseur_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },

  name: DataTypes.STRING,

});

module.exports = DimFournisseur;