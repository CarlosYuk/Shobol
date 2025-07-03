const express = require("express");
const router = express.Router();
const vehiculoCtrl = require("../controladores/vehiculoControlador");
const Vehiculo = require("../modelos/Vehiculo");
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

// Crear vehículo (ruta pública)
router.post("/", async (req, res) => {
  try {
    const { placa, modelo, anio, nombre_chofer, nombre_propietario, estado } =
      req.body;
    const vehiculo = await Vehiculo.create({
      placa,
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado: estado || "disponible",
    });
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear vehículo" });
  }
});

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

// Actualizar estado de un vehículo
router.put("/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const vehiculo = await Vehiculo.findByPk(req.params.id);
    if (!vehiculo) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    vehiculo.estado = estado;
    await vehiculo.save();
    res.json({ vehiculo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del vehículo" });
  }
});

// Obtener todos los vehículos
router.get("/", async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
});

// Crear un vehículo
router.post("/", async (req, res) => {
  try {
    const { placa, modelo, anio, nombre_chofer, nombre_propietario, estado } =
      req.body;
    const vehiculo = await Vehiculo.create({
      placa,
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado: estado || "disponible",
    });
    res.status(201).json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear vehículo" });
  }
});

// Actualizar un vehículo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Vehiculo.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).send("Vehículo no encontrado");
    }
    const vehiculoActualizado = await Vehiculo.findByPk(id);
    res.json(vehiculoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar vehículo" });
  }
});

// Eliminar un vehículo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehiculo.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).send("Vehículo no encontrado");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar vehículo" });
  }
});

// Obtener vehículos disponibles
router.get("/disponibles", vehiculoCtrl.obtenerVehiculosDisponibles);

module.exports = router;
