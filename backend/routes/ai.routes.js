const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const ROLES = require("../constants/roles");

const {
  getForecast,
  getAnomalies,
  getArimaForecast,
  getPowerBiForecast,
  getPowerBiAnomalies,
  sendTestEmailAlert,
} = require("../controllers/ai.controller");

router.get("/forecast", verifyToken, getForecast);
router.get("/anomalies", verifyToken, getAnomalies);
router.get("/forecast/arima", verifyToken, getArimaForecast);
router.get("/powerbi/forecast", verifyToken, getPowerBiForecast);
router.get("/powerbi/anomalies", verifyToken, getPowerBiAnomalies);

router.post(
  "/alerts/test-email",
  verifyToken,
  authorizeRoles(ROLES.ADMIN),
  sendTestEmailAlert
);

module.exports = router;
