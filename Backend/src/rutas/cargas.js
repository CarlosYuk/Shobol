/* const express = require("express");
const router = express.Router();
const cargaCtrl = require("../controladores/cargaControlador");
const {
  verificarToken,
  soloAdmin,
  soloGestor,
} = require("../middleware/authMiddleware");

// Listar cargas
router.get("/cargas", verificarToken, cargaCtrl.listar);

// Crear carga
router.post("/cargas", verificarToken, cargaCtrl.crear);

// Editar carga
router.put("/cargas/:id", verificarToken, cargaCtrl.editar);

// Eliminar carga (solo admin)
router.delete("/cargas/:id", verificarToken, soloAdmin, cargaCtrl.eliminar);

module.exports = router;
 */