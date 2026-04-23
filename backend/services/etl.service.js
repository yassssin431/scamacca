const {
  sequelize,

  Client,
  Project,
  Category,
  Fournisseur,
  Employee,
  Invoice,
  Expense,

  DimTime,
  DimClient,
  DimProject,
  DimCategory,
  DimFournisseur,
  DimEmployee,

  FactRevenue,
  FactExpense,
  FactSalary,

} = require("../models");



/* ===================================================== */
/* ================= DIM CLIENT ========================= */
/* ===================================================== */

exports.loadDimClient = async () => {

  await DimClient.destroy({ where: {} });

  const clients = await Client.findAll();

  for (let c of clients) {

    await DimClient.create({
      client_id: c.id,
      name: c.name,
      company: c.company,
    });

  }

  console.log("DimClient Loaded");

};



/* ===================================================== */
/* ================= DIM PROJECT ======================== */
/* ===================================================== */

exports.loadDimProject = async () => {

  await DimProject.destroy({ where: {} });

  const projects = await Project.findAll();

  for (let p of projects) {

    await DimProject.create({
      project_id: p.id,
      name: p.name,
      status: p.status,
    });

  }

  console.log("DimProject Loaded");

};



/* ===================================================== */
/* ================= DIM CATEGORY ======================= */
/* ===================================================== */

exports.loadDimCategory = async () => {

  await DimCategory.destroy({ where: {} });

  const categories = await Category.findAll();

  for (let c of categories) {

    await DimCategory.create({
      category_id: c.id,
      name: c.name,
    });

  }

  console.log("DimCategory Loaded");

};



/* ===================================================== */
/* ================= DIM FOURNISSEUR ==================== */
/* ===================================================== */

exports.loadDimFournisseur = async () => {

  await DimFournisseur.destroy({ where: {} });

  const fournisseurs = await Fournisseur.findAll();

  for (let f of fournisseurs) {

    await DimFournisseur.create({
      fournisseur_id: f.id,
      name: f.name,
    });

  }

  console.log("DimFournisseur Loaded");

};



/* ===================================================== */
/* ================= DIM EMPLOYEE ======================= */
/* ===================================================== */

exports.loadDimEmployee = async () => {

  await DimEmployee.destroy({ where: {} });

  const employees = await Employee.findAll();

  for (let e of employees) {

    await DimEmployee.create({

      employee_id: e.id,

      name:
        e.first_name +
        " " +
        (e.last_name || ""),

      position: e.position,

      team: e.team,

      department: e.department,

    });

  }

  console.log("DimEmployee Loaded");

};



/* ===================================================== */
/* ================= DIM TIME (CRITICAL) ================= */
/* ===================================================== */

exports.loadDimTime = async () => {

  await DimTime.destroy({ where: {} });

  const invoices = await Invoice.findAll();

  for (let inv of invoices) {

    if (!inv.issue_date) continue;

    const d = new Date(inv.issue_date);

    await DimTime.findOrCreate({

      where: {
        date: d,
      },

      defaults: {

        date: d,

        day: d.getDate(),

        month: d.getMonth() + 1,

        month_name:
          d.toLocaleString(
            "default",
            { month: "long" }
          ),

        quarter:
          Math.ceil(
            (d.getMonth() + 1) / 3
          ),

        year:
          d.getFullYear(),

        fiscal_year:
          d.getFullYear(),

        fiscal_quarter:
          Math.ceil(
            (d.getMonth() + 1) / 3
          ),

        is_weekend:
          d.getDay() === 0 ||
          d.getDay() === 6,

      },

    });

  }

  console.log("DimTime Loaded");

};



/* ===================================================== */
/* ================= FACT REVENUE ======================= */
/* ===================================================== */

exports.loadFactRevenue = async () => {

  await FactRevenue.destroy({ where: {} });

  const invoices = await Invoice.findAll();

  for (let inv of invoices) {

    if (!inv.issue_date) continue;

    const time = await DimTime.findOne({
      where: { date: inv.issue_date }
    });

    if (!time) continue;

    await FactRevenue.create({

      time_id: time.time_id,

      client_id: inv.ClientId,

      project_id: inv.ProjectId,

      amount: inv.amount,

      payment_status: inv.status,

    });

  }

  console.log("FactRevenue Loaded");

};



/* ===================================================== */
/* ================= FACT EXPENSE ======================= */
/* ===================================================== */

exports.loadFactExpense = async () => {

  await FactExpense.destroy({ where: {} });

  const expenses = await Expense.findAll();

  for (let exp of expenses) {

    if (!exp.date) continue;

    const time = await DimTime.findOne({
      where: { date: exp.date }
    });

    if (!time) continue;

    await FactExpense.create({

      time_id: time.time_id,

      project_id: exp.ProjectId,

      category_id: exp.CategoryId,

      fournisseur_id: exp.FournisseurId,

      amount: exp.amount,

    });

  }

  console.log("FactExpense Loaded");

};



/* ===================================================== */
/* ================= FACT SALARY ======================== */
/* ===================================================== */

exports.loadFactSalary = async () => {

  await FactSalary.destroy({ where: {} });

  const salaries =
    await sequelize.models.Salary.findAll();

  for (let sal of salaries) {

    if (!sal.payment_date) continue;

    const time = await DimTime.findOne({
      where: { date: sal.payment_date }
    });

    if (!time) continue;

    await FactSalary.create({

      time_id: time.time_id,

      employee_id: sal.EmployeeId,

      amount_paid: sal.amount_paid,

    });

  }

  console.log("FactSalary Loaded");

};