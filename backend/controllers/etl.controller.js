const etlService = require("../services/etl.service");

exports.runRevenueETL = async (req, res) => {
  const result = await etlService.generateRevenueFact();
  res.json({ message: result });
};

exports.runExpenseETL = async (req, res) => {
  const result = await etlService.generateExpenseFact();
  res.json({ message: result });
};
