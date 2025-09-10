const express = require("express");
const router = express.Router();
const vehiculoControlador = require("../controladores/vehiculoControlador");
const Vehiculo = require("../modelos/Vehiculo"); // <-- Agrega esta línea

// Endpoint para obtener todos los vehículos
router.get("/", vehiculoControlador.obtenerVehiculos);

// Obtener unidades disponibles (nueva ruta)
router.get("/unidades-disponibles", vehiculoControlador.obtenerUnidadesDisponibles);

// Ruta para crear vehículo
router.post("/", vehiculoControlador.crear);

// Editar vehículo
router.put("/:id", vehiculoControlador.editar);

// Cambiar estado de un vehículo
router.put("/:id/estado", async (req, res) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });
    vehiculo.estado = estado;
    await vehiculo.save();
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el estado del vehículo" });
  }
});

// Eliminar vehículo
router.delete("/:id", vehiculoControlador.eliminar);

// Otras rutas...
module.exports = router;
