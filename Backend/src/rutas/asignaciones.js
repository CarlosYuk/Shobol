const express = require("express");
const router = express.Router();
const asignacionCtrl = require("../controladores/asignacionControlador");
const {
  verificarToken,
  soloAdmin,
  soloGestor,
} = require("../middleware/authMiddleware");

// Listar asignaciones
router.get("/asignaciones", verificarToken, asignacionCtrl.listar);

// Crear asignación
router.post("/asignaciones", verificarToken, asignacionCtrl.crear);

module.exports = router;
