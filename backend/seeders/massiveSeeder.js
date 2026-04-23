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

  const expenses=[];

  for(let i=0;i<20000;i++){

    const project = faker.helpers.arrayElement(projects);
    const category = faker.helpers.arrayElement(categories);

    expenses.push({

      reference:`EXP-${100000+i}`,

      amount:faker.number.int({min:50,max:8000}),

      description:faker.finance.transactionDescription(),

      date:faker.date.past(),

      ProjectId:project.id,

      CategoryId:category ? category.id : null,

      createdAt:new Date(),
      updatedAt:new Date()

    });

  }

  await Expense.bulkCreate(expenses);

  console.log("20,000 expenses generated");

}
async function runSeeder(){

  try{

    await sequelize.authenticate();

    console.log("Starting MASSIVE data generation...");

    await generateClients();
    await generateEmployees();
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