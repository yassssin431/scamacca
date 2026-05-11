const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
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
const activityRoutes = require("./routes/activity.routes");
const aiRoutes = require("./routes/ai.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
require("./scheduler/ai.scheduler");


const budgetRoutes = require("./routes/budget.routes");
const devisRoutes = require("./routes/devis.routes");
const fournisseurRoutes = require("./routes/fournisseur.routes");
const salaryRoutes = require("./routes/salary.routes");

const userRoutes = require("./routes/user.routes");

const errorHandler = require("./middleware/error.middleware");


// Import middlewares
const { verifyToken } = require("./middleware/auth.middleware");
const { authorizeRoles } = require("./middleware/role.middleware");

const app = express();
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per IP
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
    });
  },
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 login attempts
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts, try again later",
    });
  },
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(globalLimiter);

/* ================= ROUTES ================= */

// Public route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Authentication routes
app.use("/api/auth/login", loginLimiter);
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
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/etl", etlRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);


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
