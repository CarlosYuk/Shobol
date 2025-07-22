const express = require("express");
const router = express.Router();
const vehiculoControlador = require("../controladores/vehiculoControlador");

// Obtener unidades disponibles (nueva ruta)
router.get("/unidades-disponibles", vehiculoControlador.obtenerUnidadesDisponibles);

module.exports = router;
