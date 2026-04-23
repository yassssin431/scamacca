const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import sequelize and models
const { sequelize, Role } = require("./models");

// Import routes
const authRoutes = require("./routes/auth.routes");
const clientRoutes = require("./routes/client.routes");
const projectRoutes = require("./routes/project.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const paymentRoutes = require("./routes/payment.routes");
const categoryRoutes = require("./routes/category.routes");
const expenseRoutes = require("./routes/expense.routes");
const employeeRoutes = require("./routes/employee.routes");
const etlRoutes = require("./routes/etl.routes");

const budgetRoutes = require("./routes/budget.routes");
const devisRoutes = require("./routes/devis.routes");
const fournisseurRoutes = require("./routes/fournisseur.routes");
const salaryRoutes = require("./routes/salary.routes");

const errorHandler = require("./middleware/error.middleware");


// Import middlewares
const { verifyToken } = require("./middleware/auth.middleware");
const { authorizeRoles } = require("./middleware/role.middleware");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(errorHandler);

/* ================= ROUTES ================= */

// Public route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Client CRUD routes
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/devis", devisRoutes);
app.use("/api/fournisseurs", fournisseurRoutes);
app.use("/api/salaries", salaryRoutes);


app.use("/api/etl", etlRoutes);

// Example protected route for Admin only
app.get(
  "/api/admin",
  verifyToken,
  authorizeRoles("Admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

/* ================= ROLE SEEDER ================= */

const seedRoles = async () => {
  const roles = ["Admin", "Manager", "Finance"];

  for (let roleName of roles) {
    const existingRole = await Role.findOne({
      where: { name: roleName },
    });

    if (!existingRole) {
      await Role.create({ name: roleName });
      console.log(`Role ${roleName} created`);
    }
  }

  console.log("Default roles checked/created");
};

app.post("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

/* ================= DATABASE CONNECTION ================= */

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connected successfully");
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    console.log("Database synced successfully");

    await seedRoles();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
  });
