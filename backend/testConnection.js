const sequelize = require("./config/database");

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

test();