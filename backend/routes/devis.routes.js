// routes/devis.routes.js
const router = require("express").Router();
const devisController = require("../controllers/devis.controller");

router.post("/", devisController.createDevis);
router.get("/", devisController.getDevisList);
router.get("/:id", devisController.getDevisById);
router.put("/:id", devisController.updateDevis);
router.delete("/:id", devisController.deleteDevis);

module.exports = router;