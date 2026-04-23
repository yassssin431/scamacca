const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Employee = sequelize.define("Employee", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },

  first_name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  last_name: { 
    type: DataTypes.STRING 
  },

  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    validate: { isEmail: true } 
  },

  phone: { 
    type: DataTypes.STRING 
  },

  position: { 
    type: DataTypes.STRING 
  },

  team: { 
    type: DataTypes.STRING,
    allowNull: false
  },

  department: { 
    type: DataTypes.STRING,
    allowNull: false
  },

  hire_date: { 
    type: DataTypes.DATE 
  },

  base_salary: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    validate: { min: 0.01 }
  },

}, {
  indexes: [
    { fields: ["team"] },
    { fields: ["department"] }
  ]
});

module.exports = Employee;
