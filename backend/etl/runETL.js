require("dotenv").config();

const runFullETL = require("./fullETL");

runFullETL()
  .then(() => process.exit())
  .catch((error) => {
    console.error("ETL Failed:", error);
    process.exit(1);
  });
