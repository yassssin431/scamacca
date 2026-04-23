// routes/salary.routes.js
const router = require("express").Router();
const salaryController = require("../controllers/salary.controller");

router.post("/", salaryController.createSalary);
router.get("/", salaryController.getSalaries);
router.get("/:id", salaryController.getSalaryById);
router.put("/:id", salaryController.updateSalary);
router.delete("/:id", salaryController.deleteSalary);

module.exports = router;