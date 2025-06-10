const express = require("express");
const router = express.Router();
const reporteCtrl = require("../controladores/reporteControlador");
const { verificarToken, soloAdmin } = require("../middleware/authMiddleware");

// Listar reportes
router.get("/reportes", verificarToken, reporteCtrl.listar);

// Crear reporte
router.post("/reportes", verificarToken, soloAdmin, reporteCtrl.crear);

module.exports = router;
