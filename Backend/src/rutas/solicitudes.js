const express = require("express");
const router = express.Router();
const solicitudCtrl = require("../controladores/solicitudControlador");
const {
  verificarToken,
  soloAdmin,
  soloGestor,
} = require("../middleware/authMiddleware");

// Listar solicitudes
router.get("/solicitudes", verificarToken, solicitudCtrl.listar);

// Crear solicitud
router.post("/solicitudes", verificarToken, solicitudCtrl.crear);

// Editar solicitud
router.put("/solicitudes/:id", verificarToken, solicitudCtrl.editar);

// Eliminar solicitud (solo admin)
router.delete(
  "/solicitudes/:id",
  verificarToken,
  soloAdmin,
  solicitudCtrl.eliminar
);

module.exports = router;
