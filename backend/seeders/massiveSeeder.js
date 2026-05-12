const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const runFullETL = require("../etl/fullETL");
faker.seed(456);

const {
  sequelize,
  Role,
  User,
  Client,
  Project,
  Invoice,
  Payment,
  Expense,
  Employee,
  Category,
  Fournisseur,
  Salary,
  Budget,
  Devis,
} = require("../models");

const quoteStatuses = ["Pending", "Sent", "Accepted", "Rejected", "Expired"];

const defaultRoles = [
  { id: 1, name: "Admin", description: "Full system administration" },
  { id: 2, name: "Manager", description: "Dashboards, commercial cycle and analysis" },
  { id: 3, name: "Finance", description: "Financial operations, budgets, expenses and salaries" }
];

const defaultUsers = [
  {
    username: "admin",
    email: "admin@test.com",
    password: "123456",
    RoleId: 1
  },
  {
    username: "manager_test",
    email: "manager@test.com",
    password: "123456",
    RoleId: 2
  },
  {
    username: "finance_test",
    email: "finance@test.com",
    password: "123456",
    RoleId: 3
  }
];

const defaultCategories = [
  { name: "Office Supplies", description: "Office materials and tools" },
  { name: "Software", description: "Software licenses and SaaS" },
  { name: "Marketing", description: "Advertising and marketing costs" },
  { name: "Travel", description: "Business travel expenses" },
  { name: "Equipment", description: "Hardware and office equipment" },
  { name: "Consulting", description: "External consultants" },
  { name: "Utilities", description: "Electricity, internet, water" },
  { name: "Training", description: "Employee training programs" },
  { name: "Rent", description: "Office or building rental costs" },
  { name: "Telecommunications", description: "Phone and communication services" },
  { name: "Licenses", description: "Business and professional licenses" }
];

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

async function resetDatabase(){

  console.log("Resetting database from current Sequelize models...");

  await sequelize.sync({ force: true });

  console.log("Database reset completed");
}

async function seedRoles(){

  console.log("Seeding roles...");

  for (const role of defaultRoles) {
    await Role.findOrCreate({
      where: { id: role.id },
      defaults: role
    });
  }

  console.log(`${defaultRoles.length} roles checked/created`);
}

async function seedDefaultUsers(){

  console.log("Seeding default users...");

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        RoleId: user.RoleId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  console.log(`${defaultUsers.length} default users checked/created`);
}

async function seedCategories(){

  console.log("Seeding categories...");

  for (const category of defaultCategories) {
    await Category.findOrCreate({
      where: { name: category.name },
      defaults: {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  console.log(`${defaultCategories.length} categories checked/created`);
}

async function generateClients() {

  console.log("Generating clients...");

  const clients = [];

  for (let i = 0; i < 200; i++) {

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    clients.push({
      name: `${firstName} ${lastName}`,
      company: faker.company.name(),
      email: `${firstName}.${lastName}${i}@company.com`.toLowerCase(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

  }

  await Client.bulkCreate(clients);

  console.log("200 clients generated");
}
async function generateEmployees(){

  console.log("Generating employees...");

  const employees = [];

  const positions = [
    "Software Developer",
    "Backend Developer",
    "Frontend Developer",
    "Project Manager",
    "UI UX Designer",
    "Accountant",
    "Data Analyst",
    "DevOps Engineer",
    "HR Manager",
    "Sales Manager"
  ];

  const teams = [
    "Backend",
    "Frontend",
    "Data",
    "QA",
    "HR",
    "Finance",
    "DevOps"
  ];

  const departments = [
    "Engineering",
    "Finance",
    "Human Resources",
    "Operations",
    "Sales"
  ];

  for(let i=0;i<50;i++){

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    employees.push({

      first_name:firstName,
      last_name:lastName,

      email:`${firstName}.${lastName}${i}@company.com`.toLowerCase(),

      phone:faker.phone.number(),

      position:faker.helpers.arrayElement(positions),

      team:faker.helpers.arrayElement(teams),

      department:faker.helpers.arrayElement(departments),

      base_salary:faker.number.int({min:2500,max:9000}),

      hire_date:faker.date.past(),

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Employee.bulkCreate(employees);


  console.log("50 employees generated");
}
async function generateSalaries(){

  console.log("Generating salaries...");

  const employees =
    await Employee.findAll();

  const salaries = [];

  for(let i=0;i<5000;i++){

    const employee =
      faker.helpers.arrayElement(employees);

    salaries.push({

      month: faker.date.month(),

      year: faker.date.past().getFullYear(),

      amount_paid:
        faker.number.int({
          min:2000,
          max:9000
        }),

      payment_date:
        faker.date.past(),

      EmployeeId:
        employee.id,

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Salary.bulkCreate(salaries);

  console.log("5000 salaries generated");

}
async function generateProjects(){

  console.log("Generating projects...");

  const clients = await Client.findAll();

  const projects=[];

  const projectTypes = [
    "Website Development",
    "Mobile Application Development",
    "ERP Implementation",
    "CRM System Development",
    "Cloud Migration",
    "Data Analytics Platform",
    "Cybersecurity Audit",
    "E-commerce Platform",
    "AI Chatbot Development",
    "Business Intelligence Dashboard"
  ];

  for(let i=0;i<500;i++){

    const client = faker.helpers.arrayElement(clients);

    const projectType = faker.helpers.arrayElement(projectTypes);

    projects.push({

      name:`${projectType} for ${client.company}`,

      description:`${projectType} project implementation for ${client.company}.`,

      start_date:faker.date.past(),

      end_date:faker.date.future(),

      status:faker.helpers.arrayElement(["Active","Completed","Pending"]),

      total_value:faker.number.int({min:5000,max:150000}),

      ClientId:client.id,

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Project.bulkCreate(projects);

  console.log("500 projects generated");

}
async function generateInvoices(){

  console.log("Generating invoices...");

  const projects = await Project.findAll();

  const invoices=[];

  for(let i=0;i<10000;i++){

    const project = faker.helpers.arrayElement(projects);

    invoices.push({

      reference:`INV-${100000+i}`,

      amount:faker.number.int({min:1000,max:20000}),

      status:faker.helpers.arrayElement(["Paid","Pending","Overdue"]),

      issue_date:faker.date.past(),

      due_date:faker.date.future(),

      ProjectId:project.id,

      ClientId:project.ClientId,

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Invoice.bulkCreate(invoices);

  console.log("10,000 invoices generated");

}

async function generatePayments(){

  console.log("Generating invoice payments...");

  const existingPayments = await Payment.findAll({
    attributes: ["InvoiceId"],
    raw: true
  });
  const invoices = await Invoice.findAll();
  const invoiceIdsWithPayments = new Set(
    existingPayments.map((payment) => payment.InvoiceId)
  );
  const methods = ["Bank Transfer", "Card", "Check", "Mobile Payment"];
  const payments = [];

  for (const invoice of invoices) {
    if (invoiceIdsWithPayments.has(invoice.id)) continue;

    const status = String(invoice.status || "").toLowerCase();
    const shouldCreatePayment =
      status === "paid" ||
      (status === "pending" && faker.number.float({ min: 0, max: 1 }) < 0.18) ||
      (status === "overdue" && faker.number.float({ min: 0, max: 1 }) < 0.35);

    if (!shouldCreatePayment) continue;

    const invoiceAmount = Number(invoice.amount || 0);
    const paidAmount = status === "paid"
      ? invoiceAmount
      : roundMoney(invoiceAmount * faker.number.float({ min: 0.25, max: 0.85 }));
    const issueDate = invoice.issue_date ? new Date(invoice.issue_date) : faker.date.past();
    const dueDate = invoice.due_date ? new Date(invoice.due_date) : new Date();
    const paymentDate = faker.date.between({
      from: issueDate,
      to: dueDate > issueDate ? dueDate : new Date()
    });

    payments.push({
      amount: roundMoney(paidAmount),
      payment_date: paymentDate,
      method: faker.helpers.arrayElement(methods),
      reference: `PAY-${invoice.reference || invoice.id}`,
      InvoiceId: invoice.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  if (!payments.length) {
    console.log("No new payments needed");
    return;
  }

  await Payment.bulkCreate(payments);

  console.log(`${payments.length} invoice payments generated`);
}

async function generateExpenses(){

  console.log("Generating expenses...");

  const projects = await Project.findAll();
  const categories = await Category.findAll();
  const fournisseurs = await Fournisseur.findAll();

  const expenses=[];

  for(let i=0;i<20000;i++){

    const project =
      faker.helpers.arrayElement(projects);

    const category =
      faker.helpers.arrayElement(categories);

    const fournisseur =
      faker.helpers.arrayElement(fournisseurs);

    expenses.push({

      reference:`EXP-${100000+i}`,

      amount:faker.number.int({
        min:50,
        max:8000
      }),

      description:
        faker.finance.transactionDescription(),

      date:faker.date.past(),

      ProjectId:project.id,

      CategoryId:category.id,

      FournisseurId:fournisseur.id,

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Expense.bulkCreate(expenses);

  console.log("20,000 expenses generated");

}
async function generateFournisseurs(){

  console.log("Generating fournisseurs...");

  const fournisseurs = [];

  for(let i=0;i<40;i++){

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    fournisseurs.push({

      name:`${firstName} ${lastName}`,

      email:`${firstName}.${lastName}${i}@supplier.com`.toLowerCase(),

      phone:faker.phone.number(),

      address:faker.location.streetAddress(),

      contact_person:`${firstName} ${lastName}`,

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Fournisseur.bulkCreate(fournisseurs);

  console.log("40 fournisseurs generated");

}

async function generateBudgets(){

  console.log("Generating project budgets...");

  const projects = await Project.findAll();
  const existingBudgets = await Budget.findAll({
    attributes: ["ProjectId"],
    raw: true
  });
  const expenseTotals = await Expense.findAll({
    attributes: [
      "ProjectId",
      [sequelize.fn("SUM", sequelize.col("amount")), "totalExpenses"]
    ],
    group: ["ProjectId"],
    raw: true
  });

  const alreadyBudgetedProjectIds = new Set(
    existingBudgets.map((budget) => budget.ProjectId)
  );
  const expenseTotalByProjectId = new Map(
    expenseTotals.map((expense) => [
      expense.ProjectId,
      Number(expense.totalExpenses || 0)
    ])
  );

  const budgets = projects
    .filter((project) => !alreadyBudgetedProjectIds.has(project.id))
    .map((project) => {
      const projectValue = Number(project.total_value || 0);
      const totalExpenses = expenseTotalByProjectId.get(project.id) || 0;
      const baselineBudget = Math.max(
        projectValue * faker.number.float({ min: 0.55, max: 0.8 }),
        totalExpenses * faker.number.float({ min: 1.08, max: 1.28 }),
        3000
      );

      return {
        amount: roundMoney(baselineBudget),
        start_date: project.start_date || faker.date.past(),
        end_date: project.end_date || faker.date.future(),
        description: `Operational budget for ${project.name}`,
        ProjectId: project.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

  if (!budgets.length) {
    console.log("No new budgets needed");
    return;
  }

  await Budget.bulkCreate(budgets);

  console.log(`${budgets.length} project budgets generated`);
}

async function generateDevis(){

  console.log("Generating commercial quotes...");

  const projects = await Project.findAll();
  const budgets = await Budget.findAll({
    attributes: ["ProjectId", "amount"],
    raw: true
  });
  const existingDevis = await Devis.findAll({
    attributes: ["ProjectId"],
    raw: true
  });

  const budgetByProjectId = new Map(
    budgets.map((budget) => [
      budget.ProjectId,
      Number(budget.amount || 0)
    ])
  );
  const quotedProjectIds = new Set(
    existingDevis.map((devis) => devis.ProjectId)
  );

  const devis = projects
    .filter((project) => !quotedProjectIds.has(project.id))
    .flatMap((project) => {
      const quoteCount = faker.number.int({ min: 1, max: 2 });
      const projectValue = Number(project.total_value || 5000);
      const budgetAmount = budgetByProjectId.get(project.id) || 0;
      const commercialBase = Math.max(projectValue, budgetAmount * 1.18, 5000);

      return Array.from({ length: quoteCount }, (_, quoteIndex) => {
        const issueDate = faker.date.between({
          from: addDays(project.start_date || new Date(), -45),
          to: project.start_date || new Date()
        });
        const status = quoteIndex === 0
          ? faker.helpers.arrayElement(["Accepted", "Sent", "Pending"])
          : faker.helpers.arrayElement(quoteStatuses);
        const amountMultiplier = status === "Accepted"
          ? faker.number.float({ min: 0.98, max: 1.08 })
          : faker.number.float({ min: 0.9, max: 1.12 });

        return {
          reference: `DEV-${String(project.id).padStart(5, "0")}-${quoteIndex + 1}`,
          amount: roundMoney(commercialBase * amountMultiplier),
          status,
          issue_date: issueDate,
          validity_date: addDays(issueDate, faker.number.int({ min: 15, max: 60 })),
          ClientId: project.ClientId,
          ProjectId: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
    });

  if (!devis.length) {
    console.log("No new commercial quotes needed");
    return;
  }

  await Devis.bulkCreate(devis);

  console.log(`${devis.length} commercial quotes generated`);
}

async function normalizeCommercialData(){

  console.log("Normalizing commercial quote values...");

  const projects = await Project.findAll({
    attributes: ["id", "total_value"],
    raw: true
  });
  const budgets = await Budget.findAll({
    attributes: ["ProjectId", "amount"],
    raw: true
  });
  const devisList = await Devis.findAll();

  const projectValueById = new Map(
    projects.map((project) => [
      project.id,
      Number(project.total_value || 0)
    ])
  );
  const budgetByProjectId = new Map(
    budgets.map((budget) => [
      budget.ProjectId,
      Number(budget.amount || 0)
    ])
  );

  for (const devis of devisList) {
    const projectValue = projectValueById.get(devis.ProjectId) || 0;
    const budgetAmount = budgetByProjectId.get(devis.ProjectId) || 0;
    const commercialBase = Math.max(projectValue, budgetAmount * 1.18, 5000);
    const amountMultiplier = devis.status === "Accepted"
      ? faker.number.float({ min: 0.98, max: 1.08 })
      : faker.number.float({ min: 0.9, max: 1.12 });

    await devis.update({
      amount: roundMoney(commercialBase * amountMultiplier)
    });
  }

  console.log(`${devisList.length} commercial quotes normalized`);
}

async function runSeeder(){

  try{

    await sequelize.authenticate();

    const shouldReset = process.argv.includes("--reset");
    const commercialOnly = process.argv.includes("--commercial-only");
    const paymentsOnly = process.argv.includes("--payments-only");

    if ([shouldReset, commercialOnly, paymentsOnly].filter(Boolean).length > 1) {
      throw new Error("Use only one mode: --reset, --commercial-only or --payments-only.");
    }

    if (shouldReset) {
      console.log("Starting clean database reset and reseed...");

      await resetDatabase();
      await seedRoles();
      await seedDefaultUsers();
      await seedCategories();
      await generateClients();
      await generateEmployees();
      await generateSalaries();
      await generateFournisseurs();
      await generateProjects();
      await generateInvoices();
      await generatePayments();
      await generateExpenses();
      await generateBudgets();
      await generateDevis();
      await normalizeCommercialData();
      await runFullETL();

      console.log("Clean database reset and reseed completed");
      process.exit();
    }

    if (commercialOnly) {
      console.log("Starting commercial data generation...");

      await generateBudgets();
      await generateDevis();
      await normalizeCommercialData();
      await generatePayments();

      console.log("Commercial data generation completed");
      process.exit();
    }

    if (paymentsOnly) {
      console.log("Starting payment data generation...");

      await generatePayments();

      console.log("Payment data generation completed");
      process.exit();
    }

    console.log("Starting MASSIVE data generation...");

    await seedRoles();
    await seedDefaultUsers();
    await seedCategories();
    await generateClients();
    await generateEmployees();
    await generateSalaries();
    await generateFournisseurs();
    await generateProjects();
    await generateInvoices();
    await generatePayments();
    await generateExpenses();
    await generateBudgets();
    await generateDevis();
    await normalizeCommercialData();
    

    console.log("Massive data generation completed");

    process.exit();

  }
  catch(error){

    console.error("Seeder error:",error);

  }

}

runSeeder();
