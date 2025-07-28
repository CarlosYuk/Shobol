const express = require("express");
const router = express.Router();
const vehiculoControlador = require("../controladores/vehiculoControlador");

// Endpoint para obtener todos los vehículos
router.get("/", vehiculoControlador.obtenerVehiculos);

// Obtener unidades disponibles (nueva ruta)
router.get("/unidades-disponibles", vehiculoControlador.obtenerUnidadesDisponibles);

// Ruta para crear vehículo
router.post("/", vehiculoControlador.crear);

// Editar vehículo
router.put("/:id", vehiculoControlador.editar);

// Eliminar vehículo
router.delete("/:id", vehiculoControlador.eliminar);

// Otras rutas...
module.exports = router;
