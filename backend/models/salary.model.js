const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Salary = sequelize.define("Salary", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  month: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  amount_paid: { 
  type: DataTypes.FLOAT, 
  allowNull: false,
  validate: { min: 0.01 }
},
  payment_date: { type: DataTypes.DATE, allowNull: false },
},  {
    indexes: [
      { fields: ["payment_date"] },
      { fields: ["EmployeeId"] },
    ],
  });

module.exports = Salary;
