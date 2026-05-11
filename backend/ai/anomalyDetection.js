// ai/anomalyDetection.js
const { FactExpense, DimTime } = require("../models");

/*
  🎯 PURPOSE:
  Detect abnormal expenses using statistical method
  + include DimTime to show month/year context
*/

exports.detectAnomalies = async () => {
  try {
    const expenses = await FactExpense.findAll({
      include: [
        {
          model: DimTime,
          attributes: ["month", "year", "month_name"]
        }
      ],
      order: [["time_id", "DESC"]]
    });

    if (expenses.length === 0) {
      return { message: "No expense data available" };
    }

    // 1. Calculate average
    const amounts = expenses.map(e => e.amount);
    const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;

    // 2. Calculate standard deviation
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // 3. Detect anomalies (above avg + 2*stdDev)
    const anomalies = expenses.filter(e => e.amount > avg + 2 * stdDev);

    return {
      averageExpense: avg,
      stdDeviation: stdDev,
      anomalies: anomalies.map(e => ({
        id: e.id,
        amount: e.amount,
        project_id: e.project_id,
        client_id: e.client_id,
        month: e.DimTime ? e.DimTime.month : null,
        year: e.DimTime ? e.DimTime.year : null,
        month_name: e.DimTime ? e.DimTime.month_name : null,
        reason: "Above normal statistical range"
      }))
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
