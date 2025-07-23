const express = require("express");
const router = express.Router();
const vehiculoControlador = require("../controladores/vehiculoControlador");

// Endpoint para obtener todos los vehículos
router.get("/", vehiculoControlador.obtenerVehiculos);

// Obtener unidades disponibles (nueva ruta)
router.get("/unidades-disponibles", vehiculoControlador.obtenerUnidadesDisponibles);

module.exports = router;
