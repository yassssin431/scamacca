const {
  loadDimClient,
  loadDimProject,
  loadDimCategory,
  loadDimFournisseur,
  loadDimEmployee,
  loadDimTime,
  loadFactRevenue,
  loadFactExpense,
  loadFactSalary,
} = require("../services/etl.service");

async function runFullETL() {
  console.log("Starting FULL ETL Process...");

  // Dimensions must be rebuilt before facts because facts reference dimension keys.
  await loadDimClient();
  await loadDimProject();
  await loadDimCategory();
  await loadDimFournisseur();
  await loadDimEmployee();
  await loadDimTime();

  await loadFactRevenue();
  await loadFactExpense();
  await loadFactSalary();

  console.log("FULL ETL Completed Successfully");
}

module.exports = runFullETL;
