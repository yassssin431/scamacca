require("dotenv").config();

const {
  sequelize,
  Client,
  Project,
  Invoice,
  Expense,
  Category,
  Fournisseur,
} = require("../models");

const months = [
  ["2024-01-01", 8200, 2300],
  ["2024-02-01", 8600, 2450],
  ["2024-03-01", 9100, 2600],
  ["2024-04-01", 9550, 2550],
  ["2024-05-01", 10100, 2750],
  ["2024-06-01", 9900, 2900],
  ["2024-07-01", 10850, 12000],
  ["2024-08-01", 11200, 3100],
  ["2024-09-01", 11750, 2950],
  ["2024-10-01", 12400, 3300],
  ["2024-11-01", 12950, 3450],
  ["2024-12-01", 14100, 3600],
  ["2025-01-01", 13600, 3400],
  ["2025-02-01", 14350, 3650],
  ["2025-03-01", 15100, 3800],
  ["2025-04-01", 15800, 15000],
  ["2025-05-01", 16650, 4100],
  ["2025-06-01", 16100, 3950],
  ["2025-07-01", 17400, 4300],
  ["2025-08-01", 18150, 4550],
  ["2025-09-01", 18900, 4700],
  ["2025-10-01", 19750, 4900],
  ["2025-11-01", 20500, 5100],
  ["2025-12-01", 22100, 5400],
];

const addDays = (date, days) => {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

async function findOrCreateCategory(name, description, transaction) {
  const [category] = await Category.findOrCreate({
    where: { name },
    defaults: { description },
    transaction,
  });

  return category;
}

async function seedMlBusinessData() {
  const transaction = await sequelize.transaction();

  try {
    console.log("Preparing ML business demo data...");

    await Expense.destroy({
      where: {
        reference: months.map((_, index) => `EXP-ML-${String(index + 1).padStart(2, "0")}`),
      },
      transaction,
    });

    await Invoice.destroy({
      where: {
        reference: months.map((_, index) => `INV-ML-${String(index + 1).padStart(2, "0")}`),
      },
      transaction,
    });

    const [client] = await Client.findOrCreate({
      where: { email: "ml-demo-client@tradrly.test" },
      defaults: {
        name: "ML Demo Client",
        company: "Tradrly Analytics Demo",
        phone: "+212600000000",
        address: "Casablanca",
      },
      transaction,
    });

    const [project] = await Project.findOrCreate({
      where: { name: "ML Revenue Trend Demo" },
      defaults: {
        description: "Synthetic monthly project used to test forecasting and anomaly detection.",
        start_date: new Date("2024-01-01T00:00:00.000Z"),
        end_date: new Date("2025-12-31T00:00:00.000Z"),
        status: "Active",
        total_value: 350000,
        ClientId: client.id,
      },
      transaction,
    });

    const softwareCategory = await findOrCreateCategory(
      "Software",
      "Licenses, subscriptions, and platform costs",
      transaction
    );

    const operationsCategory = await findOrCreateCategory(
      "Operations",
      "Operational costs used by ML demo data",
      transaction
    );

    const [supplier] = await Fournisseur.findOrCreate({
      where: { email: "ml-demo-supplier@tradrly.test" },
      defaults: {
        name: "ML Demo Supplier",
        phone: "+212611111111",
        address: "Rabat",
        contact_person: "Demo Supplier",
      },
      transaction,
    });

    const invoices = months.map(([date, revenue], index) => ({
      reference: `INV-ML-${String(index + 1).padStart(2, "0")}`,
      amount: revenue,
      status: "Paid",
      issue_date: new Date(`${date}T00:00:00.000Z`),
      due_date: addDays(date, 15),
      ProjectId: project.id,
      ClientId: client.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const expenses = months.map(([date, , expense], index) => ({
      reference: `EXP-ML-${String(index + 1).padStart(2, "0")}`,
      amount: expense,
      description:
        expense >= 10000
          ? "Exceptional infrastructure and emergency support cost"
          : "Recurring operating cost",
      date: addDays(date, 5),
      ProjectId: project.id,
      CategoryId: expense >= 10000 ? operationsCategory.id : softwareCategory.id,
      FournisseurId: supplier.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Invoice.bulkCreate(invoices, { transaction });
    await Expense.bulkCreate(expenses, { transaction });

    await transaction.commit();

    console.log("ML business demo data inserted:");
    console.log(`- ${invoices.length} invoices over 24 months`);
    console.log(`- ${expenses.length} expenses with 2 clear anomaly spikes`);
    console.log("");
    console.log("Next step: run `node etl/runETL.js` from the backend folder.");

    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    console.error("ML business demo seeding failed:", error);
    process.exit(1);
  }
}

seedMlBusinessData();
