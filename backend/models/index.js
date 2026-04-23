const sequelize = require("../config/database");

const Role = require("./role.model");
const User = require("./user.model");
const Client = require("./client.model");
const Fournisseur = require("./fournisseur.model");
const Category = require("./category.model");
const Project = require("./project.model");
const Devis = require("./devis.model");
const Invoice = require("./invoice.model");
const Payment = require("./payment.model");
const Expense = require("./expense.model");
const Employee = require("./employee.model");
const Salary = require("./salary.model");
const Budget = require("./budget.model");
const FactRevenue = require("./factRevenue.model");
const FactExpense = require("./factExpense.model");
const FactSalary = require("./factSalary.model");
const DimTime = require("./dimTime.model");
const DimClient = require("./dimClient.model");
const DimProject = require("./dimProject.model");
const DimCategory = require("./dimCategory.model");
const DimFournisseur = require("./dimFournisseur.model");
const DimEmployee = require("./dimEmployee.model");

/* ================= RELATIONSHIPS ================= */

// Role → Users
Role.hasMany(User, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});
User.belongsTo(Role);

// Client → Projects
Client.hasMany(Project, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});
Project.belongsTo(Client);

// Client → Devis
Client.hasMany(Devis, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});
Devis.belongsTo(Client);


// Client → Invoices
Client.hasMany(Invoice, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT"
});
Invoice.belongsTo(Client);

// Project → Devis
Project.hasMany(Devis, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});
Devis.belongsTo(Project);


// Project → Invoices
Project.hasMany(Invoice, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT"
});
Invoice.belongsTo(Project);

// Invoice → Payments
Invoice.hasMany(Payment, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Payment.belongsTo(Invoice);

// Project → Expenses
Project.hasMany(Expense, {
  foreignKey: { allowNull: false },
  onDelete: "RESTRICT"
});
Expense.belongsTo(Project);

// Category → Expenses
Category.hasMany(Expense, {
  onDelete: "SET NULL"
});
Expense.belongsTo(Category);

// Fournisseur → Expenses
Fournisseur.hasMany(Expense);
Expense.belongsTo(Fournisseur);

// Employee → Salaries
Employee.hasMany(Salary, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Salary.belongsTo(Employee);

// Project → Budget (One-to-One)
Project.hasOne(Budget, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Budget.belongsTo(Project);

// Devis → Invoice (0..1)
Devis.hasOne(Invoice, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE"
});
Invoice.belongsTo(Devis);


module.exports = {
  sequelize,
  Role,
  User,
  Client,
  Fournisseur,
  Category,
  Project,
  Devis,
  Invoice,
  Payment,
  Expense,
  Employee,
  Salary,
  Budget,
  FactRevenue,
  FactExpense,
  FactSalary,
  DimTime,
  DimClient,
  DimProject,
  DimCategory,
  DimFournisseur,
  DimEmployee,
  
};
