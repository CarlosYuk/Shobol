const express = require("express");
const router = express.Router();
const vehiculoCtrl = require("../controladores/vehiculoControlador");
const {
  verificarToken,
  soloAdmin,
  soloGestor,
} = require("../middleware/authMiddleware");

// Listar todos (usuarios autenticados)
router.get("/vehiculos", verificarToken, vehiculoCtrl.listar);

// Crear vehículo (admin o gestor)
router.post(
  "/vehiculos",
  verificarToken,
  (req, res, next) => {
    if (req.usuario.rol === "administrador" || req.usuario.rol === "gestor") {
      return next();
    }
    res
      .status(403)
      .json({ mensaje: "Solo administrador o gestor puede crear." });
  },
  vehiculoCtrl.crear
);

// Editar vehículo (admin o gestor)
router.put(
  "/vehiculos/:id",
  verificarToken,
  (req, res, next) => {
    if (req.usuario.rol === "administrador" || req.usuario.rol === "gestor") {
      return next();
    }
    res
      .status(403)
      .json({ mensaje: "Solo administrador o gestor puede editar." });
  },
  vehiculoCtrl.editar
);

// Eliminar vehículo (solo admin)
router.delete(
  "/vehiculos/:id",
  verificarToken,
  soloAdmin,
  vehiculoCtrl.eliminar
);

module.exports = router;
