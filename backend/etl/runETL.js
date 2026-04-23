require("dotenv").config();

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



async function runETL() {

  try {

    console.log("Starting FULL ETL Process...");


    /* ================= DIMENSIONS ================= */

    await loadDimClient();

    await loadDimProject();

    await loadDimCategory();

    await loadDimFournisseur();

    await loadDimEmployee();

    await loadDimTime();


    /* ================= FACTS ================= */

    await loadFactRevenue();

    await loadFactExpense();

    await loadFactSalary();


    console.log(
      "FULL ETL Completed Successfully"
    );

    process.exit();

  }

  catch (error) {

    console.error(
      "ETL Failed:",
      error
    );

  }

}

runETL();