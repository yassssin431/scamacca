// routes/budget.routes.js
const router = require("express").Router();
const budgetController = require("../controllers/budget.controller");

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudgets);
router.get("/:id", budgetController.getBudgetById);
router.put("/:id", budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;