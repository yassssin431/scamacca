const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  entity: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ActivityLog;