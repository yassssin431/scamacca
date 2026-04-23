const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fournisseur = sequelize.define("Fournisseur", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  contact_person: { type: DataTypes.STRING },
});

module.exports = Fournisseur;
