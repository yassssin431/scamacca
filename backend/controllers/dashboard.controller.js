const { fn, col } = require("sequelize");
const { Client, Project, Invoice, Expense, Salary, Category } = require("../models");

const toNumber = (value) => Number(value || 0);

const getSum = async (model, field) => {
  const total = await model.sum(field);
  return toNumber(total);
};

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const [
      clientCount,
      projectCount,
      invoiceCount,
      expenseCount,
      salaryCount,
      totalRevenue,
      totalExpenses,
      totalSalaries,
      topProjects,
      recentInvoices,
      expenseByCategory,
      invoiceStatusRows,
    ] = await Promise.all([
      Client.count(),
      Project.count(),
      Invoice.count(),
      Expense.count(),
      Salary.count(),
      getSum(Invoice, "amount"),
      getSum(Expense, "amount"),
      getSum(Salary, "amount_paid"),
      Project.findAll({
        include: Client,
        order: [["total_value", "DESC"]],
        limit: 5,
      }),
      Invoice.findAll({
        include: Client,
        order: [["issue_date", "DESC"]],
        limit: 3,
      }),
      Expense.findAll({
        attributes: [
          [fn("COALESCE", col("Category.name"), "Uncategorized"), "name"],
          [fn("SUM", col("Expense.amount")), "amount"],
        ],
        include: [{ model: Category, attributes: [] }],
        group: ["Category.id", "Category.name"],
        order: [[fn("SUM", col("Expense.amount")), "DESC"]],
        limit: 6,
        raw: true,
      }),
      Invoice.findAll({
        attributes: ["status", [fn("COUNT", col("id")), "count"]],
        group: ["status"],
        raw: true,
      }),
    ]);

    const netProfit = totalRevenue - totalExpenses - totalSalaries;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const invoiceStatus = invoiceStatusRows.reduce(
      (acc, row) => ({
        ...acc,
        [row.status || "Unknown"]: Number(row.count || 0),
      }),
      {}
    );

    res.json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: {
        counts: {
          clients: clientCount,
          projects: projectCount,
          invoices: invoiceCount,
          expenses: expenseCount,
          salaries: salaryCount,
        },
        totals: {
          revenue: totalRevenue,
          expenses: totalExpenses,
          salaries: totalSalaries,
          netProfit,
          profitMargin,
        },
        invoiceStatus,
        topProjects,
        recentInvoices,
        expenseByCategory: expenseByCategory.map((item) => ({
          name: item.name,
          amount: toNumber(item.amount),
          value: toNumber(item.amount),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
