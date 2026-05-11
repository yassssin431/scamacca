const axios = require("axios");
const Prediction = require("../models/prediction.model");
const { sendTestAlertEmail } = require("../services/alertNotification.service");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

/* ================= FORECAST (Python Microservice) ================= */
exports.getForecast = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/ml/forecast/revenue`);
    const forecastData = response.data.linearRegressionForecast;

    if (forecastData && forecastData.length > 0) {
      for (const value of forecastData) {
        await Prediction.create({
          type: "Revenue Forecast (Linear Regression)",
          predicted_value: value,
        });
      }
    }

    return res.status(200).json({
      message: "Revenue forecast generated and saved",
      data: forecastData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating forecast",
      error: error.message,
    });
  }
};

/* ================= ANOMALIES (Python Microservice) ================= */
exports.getAnomalies = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/ml/anomalies/expenses`);
    const anomaliesData = response.data.anomalies;

    if (anomaliesData && anomaliesData.length > 0) {
      for (const anomaly of anomaliesData) {
        await Prediction.create({
          type: "Expense Anomaly (Isolation Forest)",
          predicted_value: anomaly.amount,
        });
      }
    }

    return res.status(200).json({
      message: "Anomalies detected and saved",
      data: anomaliesData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error detecting anomalies",
      error: error.message,
    });
  }
};

/* ================= ARIMA FORECAST (Python Microservice) ================= */
exports.getArimaForecast = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/ml/arima/revenue`);
    const arimaData = response.data.arimaForecast;

    if (arimaData && arimaData.length > 0) {
      for (const value of arimaData) {
        await Prediction.create({
          type: "Revenue Forecast (ARIMA)",
          predicted_value: value,
        });
      }
    }

    return res.status(200).json({
      message: "ARIMA forecast generated and saved",
      data: arimaData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating ARIMA forecast",
      error: error.message,
    });
  }
};

/* ================= POWER BI FORECAST DATASET ================= */
exports.getPowerBiForecast = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/ml/powerbi/revenue-forecast`);

    return res.status(200).json({
      message: "Power BI revenue forecast dataset generated",
      data: response.data.data || [],
      summary: response.data.summary || {},
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating Power BI forecast dataset",
      error: error.message,
    });
  }
};

/* ================= POWER BI ANOMALY DATASET ================= */
exports.getPowerBiAnomalies = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/ml/powerbi/expense-anomalies`);

    return res.status(200).json({
      message: "Power BI anomaly dataset generated",
      data: response.data.data || [],
      summary: response.data.summary || {},
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating Power BI anomaly dataset",
      error: error.message,
    });
  }
};

/* ================= EMAIL ALERT TEST ================= */
exports.sendTestEmailAlert = async (req, res) => {
  try {
    const result = await sendTestAlertEmail({
      requestedBy: req.user?.id,
    });

    return res.status(result.sent ? 200 : 202).json({
      success: result.sent,
      message: result.sent
        ? "Test alert email sent"
        : "Test alert email skipped because email service is not configured",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending test alert email",
      error: error.message,
    });
  }
};
