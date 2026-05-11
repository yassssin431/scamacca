// ai/revenueForecast.js
const { FactRevenue, DimTime } = require("../models");

/*
  🎯 PURPOSE:
  Predict next months revenue using trend-based logic
  + include DimTime to show month/year context
*/

exports.getRevenueForecast = async () => {
  try {
    // 1. Get last 6 months revenue
    const revenues = await FactRevenue.findAll({
      include: [
        {
          model: DimTime,
          attributes: ["month", "year", "month_name"]
        }
      ],
      order: [["time_id", "ASC"]],
      limit: 6
    });

    if (revenues.length < 2) {
      return { message: "Not enough data for forecast" };
    }

    // 2. Extract values
    const values = revenues.map(r => r.amount);

    // 3. Calculate monthly growth rates
    let growthRates = [];
    for (let i = 1; i < values.length; i++) {
      const growth = (values[i] - values[i - 1]) / values[i - 1];
      growthRates.push(growth);
    }

    // 4. Average growth
    const avgGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

    // 5. Forecast next 3 months
    let lastRevenue = values[values.length - 1];
    const forecast = [];

    for (let i = 1; i <= 3; i++) {
      lastRevenue = lastRevenue * (1 + avgGrowth);
      forecast.push({
        month: `Forecast +${i}`,
        predictedRevenue: Math.round(lastRevenue)
      });
    }

    return {
      growthRate: avgGrowth.toFixed(2),
      history: revenues.map(r => ({
        amount: r.amount,
        month: r.DimTime.month,
        year: r.DimTime.year,
        month_name: r.DimTime.month_name
      })),
      forecast
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
