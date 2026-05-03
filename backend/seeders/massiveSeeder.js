const { faker } = require("@faker-js/faker");
faker.seed(456);

const {
  sequelize,
  Client,
  Project,
  Invoice,
  Expense,
  Employee,
  Category,
  Fournisseur,
  Salary,
} = require("../models");
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

async function runSeeder(){

  try{

    await sequelize.authenticate();

    console.log("Starting MASSIVE data generation...");

    await generateClients();
    await generateEmployees();
    await generateSalaries();
    await generateFournisseurs();
    await generateProjects();
    await generateInvoices();
    await generateExpenses();
    

    console.log("Massive data generation completed");

    process.exit();

  }
  catch(error){

    console.error("Seeder error:",error);

  }

}

runSeeder();