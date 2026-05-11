const cron = require("node-cron");
const axios = require("axios");
const { Prediction, Alert } = require("../models");
const { notifyAlert } = require("../services/alertNotification.service");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

/* ========================= */
/* DAILY AI TRAINING */
/* ========================= */
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily AI prediction...");

  try {
    const forecast = await axios.get(`${AI_SERVICE_URL}/ml/forecast/revenue`);
    for (const value of forecast.data.linearRegressionForecast || []) {
      await Prediction.create({
        type: "LinearRegression",
        predicted_value: value,
      });
    }
    console.log("Forecast saved");

    const arima = await axios.get(`${AI_SERVICE_URL}/ml/arima/revenue`);
    for (const value of arima.data.arimaForecast || []) {
      await Prediction.create({
        type: "ARIMA",
        predicted_value: value,
      });
    }
    console.log("ARIMA saved");

    const anomalies = await axios.get(`${AI_SERVICE_URL}/ml/anomalies/expenses`);
    const anomalyRows = anomalies.data.anomalies || [];

    if (anomalyRows.length > 0) {
      const alert = await Alert.create({
        type: "Expense Anomaly",
        severity: "HIGH",
        message: `${anomalyRows.length} anomalies detected`,
      });

      const emailResult = await notifyAlert({
        alert,
        anomalies: anomalyRows,
      });

      console.log("Alert created");
      console.log(`[email] anomaly notification: ${emailResult.sent ? "sent" : emailResult.reason}`);
    }
  } catch (error) {
    console.error("AI Scheduler Error:", error.message);
  }
});
