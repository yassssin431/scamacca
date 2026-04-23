// routes/fournisseur.routes.js
const router = require("express").Router();
const fournisseurController = require("../controllers/fournisseur.controller");

router.post("/", fournisseurController.createFournisseur);
router.get("/", fournisseurController.getFournisseurs);
router.get("/:id", fournisseurController.getFournisseurById);
router.put("/:id", fournisseurController.updateFournisseur);
router.delete("/:id", fournisseurController.deleteFournisseur);

module.exports = router;