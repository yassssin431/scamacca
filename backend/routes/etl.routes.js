const express = require("express");
const router = express.Router();
const etlController = require("../controllers/etl.controller");

router.post("/revenue", etlController.runRevenueETL);
router.post("/expense", etlController.runExpenseETL);

module.exports = router;
