const express = require("express");
const router = express.Router();
const rutaCtrl = require("../controladores/rutaControlador");
const {
  verificarToken,
  soloAdmin,
  soloGestor,
} = require("../middleware/authMiddleware");

// Listar rutas
router.get("/rutas", verificarToken, rutaCtrl.listar);

// Crear ruta (admin o gestor)
router.post(
  "/rutas",
  verificarToken,
  (req, res, next) => {
    if (req.usuario.rol === "administrador" || req.usuario.rol === "gestor") {
      return next();
    }
    res
      .status(403)
      .json({ mensaje: "Solo administrador o gestor puede crear." });
  },
  rutaCtrl.crear
);

// Editar ruta (admin o gestor)
router.put(
  "/rutas/:id",
  verificarToken,
  (req, res, next) => {
    if (req.usuario.rol === "administrador" || req.usuario.rol === "gestor") {
      return next();
    }
    res
      .status(403)
      .json({ mensaje: "Solo administrador o gestor puede editar." });
  },
  rutaCtrl.editar
);

// Eliminar ruta (solo admin)
router.delete("/rutas/:id", verificarToken, soloAdmin, rutaCtrl.eliminar);

module.exports = router;
