const { faker } = require("@faker-js/faker");
faker.seed(123);

const {
  sequelize,
  Client,
  Project,
  Invoice,
  Expense,
  Employee,
  Category,
} = require("../models");

/* ================= SEED CLIENTS ================= */

async function seedClients() {
  console.log("Creating clients...");

  for (let i = 0; i < 50; i++) {
    await Client.create({
      name: faker.person.fullName(),
      company: faker.company.name(),
      email: faker.internet.username() + i + "@company.com",
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
    });
  }

  console.log("50 clients created");
}

/* ================= SEED EMPLOYEES ================= */

async function seedEmployees() {
  console.log("Creating employees...");

  const positions = [
    "Developer",
    "Project Manager",
    "Designer",
    "Accountant",
    "HR",
    "Business Analyst",
    "Data Analyst",
    "Quality Assurance Tester",
    "System Administrator",
    "Marketing Specialist",
    "Sales Executive",
    "Customer Support",
    "Consultant",
    "Product Owner",
    "Scrum Master",
    "Legal Advisor",
    
  ];

  for (let i = 0; i < 20; i++) {
    await Employee.create({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.username() + i + "@company.com",
      phone: faker.phone.number(),
      position: faker.helpers.arrayElement(positions),
      base_salary: faker.number.int({ min: 2000, max: 8000 }),
      hire_date: faker.date.past(),
    });
  }

  console.log("20 employees created");
}

/* ================= SEED PROJECTS ================= */

async function seedProjects() {
  console.log("Creating projects...");

  const clients = await Client.findAll();

  for (let i = 0; i < 100; i++) {
    const client = faker.helpers.arrayElement(clients);

    await Project.create({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      start_date: faker.date.past(),
      end_date: faker.date.future(),
      total_value: faker.number.int({ min: 5000, max: 100000 }),
      status: faker.helpers.arrayElement([
        "active",
        "completed",
        "pending",
      ]),
      ClientId: client.id,
    });
  }

  console.log("100 projects created");
}

/* ================= SEED INVOICES ================= */

async function seedInvoices() {
  console.log("Creating invoices...");

  const projects = await Project.findAll();

  for (let i = 0; i < 300; i++) {
    const project = faker.helpers.arrayElement(projects);

    await Invoice.create({
      reference: "INV-" + faker.number.int({ min: 10000, max: 99999 }),
      amount: faker.number.int({ min: 1000, max: 10000 }),
      status: faker.helpers.arrayElement([
        "paid",
        "pending",
        "overdue",
      ]),
      issue_date: faker.date.past(),
      due_date: faker.date.future(),
      ProjectId: project.id,
      ClientId: project.ClientId,
    });
  }

  console.log("300 invoices created");
}

/* ================= SEED EXPENSES ================= */

async function seedExpenses() {
  console.log("Creating expenses...");

  const projects = await Project.findAll();
  const categories = await Category.findAll();

  for (let i = 0; i < 500; i++) {
    const project = faker.helpers.arrayElement(projects);
    const category = faker.helpers.arrayElement(categories);

    await Expense.create({
      reference: "EXP-" + faker.number.int({ min: 10000, max: 99999 }),
      amount: faker.number.int({ min: 100, max: 5000 }),
      description: faker.commerce.productDescription(),
      date: faker.date.past(),
      ProjectId: project.id,
      CategoryId: category.id,
    });
  }

  console.log("500 expenses created");
}

/* ================= MAIN SEED FUNCTION ================= */

async function seedDatabase() {
  try {
    await sequelize.authenticate();

    console.log("Starting database seeding...");

    await seedClients();
    await seedEmployees();
    await seedProjects();
    await seedInvoices();
    await seedExpenses();

    console.log("Database seeding completed successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

seedDatabase();