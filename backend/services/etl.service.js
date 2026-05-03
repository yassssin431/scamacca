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

  console.log("Loading DimTime...");

  /* ================= GET ALL DATES ================= */

  const invoices = await Invoice.findAll();
  const expenses = await Expense.findAll();
  const salaries =
    await sequelize.models.Salary.findAll();

  const datesSet = new Set();


  /* ========= INVOICE DATES ========= */

  for (let inv of invoices) {

    if (inv.issue_date) {

      datesSet.add(
        new Date(inv.issue_date)
          .toISOString()
          .split("T")[0]
      );

    }

  }


  /* ========= EXPENSE DATES ========= */

  for (let exp of expenses) {

    if (exp.date) {

      datesSet.add(
        new Date(exp.date)
          .toISOString()
          .split("T")[0]
      );

    }

  }


  /* ========= SALARY DATES ========= */

  for (let sal of salaries) {

    if (sal.payment_date) {

      datesSet.add(
        new Date(sal.payment_date)
          .toISOString()
          .split("T")[0]
      );

    }

  }


  /* ========= INSERT DIM TIME ========= */

  for (let dateStr of datesSet) {

    const d = new Date(dateStr);

    await DimTime.create({

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

    });

  }

  console.log(
    "DimTime Loaded with ALL dates"
  );

};



/* ===================================================== */
/* ================= FACT REVENUE ======================= */
/* ===================================================== */

exports.loadFactRevenue = async () => {

  await FactRevenue.destroy({ where: {} });

  const invoices = await Invoice.findAll();

  for (let inv of invoices) {

    if (!inv.issue_date) continue;

    const dateOnly =
      new Date(inv.issue_date)
        .toISOString()
        .split("T")[0];

    const time = await DimTime.findOne({

      where: sequelize.where(
        sequelize.fn("DATE", sequelize.col("date")),
        dateOnly
      )

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
  const times = await DimTime.findAll();

  const timeMap = new Map();

  for (let t of times) {
    const key = new Date(t.date).toISOString().split("T")[0];
    timeMap.set(key, t.time_id);
  }

  const rows = [];

  for (let exp of expenses) {
    if (!exp.date) continue;

    const dateOnly = new Date(exp.date).toISOString().split("T")[0];
    const timeId = timeMap.get(dateOnly);

    if (!timeId) continue;

    rows.push({
      time_id: timeId,
      project_id: exp.ProjectId,
      category_id: exp.CategoryId,
      fournisseur_id: exp.FournisseurId,
      amount: exp.amount,
    });
  }

  await FactExpense.bulkCreate(rows);

  console.log(`FactExpense Loaded: ${rows.length}`);
};


/* ===================================================== */
/* ================= FACT SALARY ======================== */
/* ===================================================== */

exports.loadFactSalary = async () => {
  await FactSalary.destroy({ where: {} });

  const salaries = await sequelize.models.Salary.findAll();
  const times = await DimTime.findAll();

  const timeMap = new Map();

  for (let t of times) {
    const key = new Date(t.date).toISOString().split("T")[0];
    timeMap.set(key, t.time_id);
  }

  const rows = [];

  for (let sal of salaries) {
    if (!sal.payment_date) continue;

    const dateOnly = new Date(sal.payment_date).toISOString().split("T")[0];
    const timeId = timeMap.get(dateOnly);

    if (!timeId) continue;

    rows.push({
      time_id: timeId,
      employee_id: sal.EmployeeId,
      amount_paid: sal.amount_paid,
    });
  }

  await FactSalary.bulkCreate(rows);

  console.log(`FactSalary Loaded: ${rows.length}`);
};