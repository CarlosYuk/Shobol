const express = require("express");
const router = express.Router();
const Chofer = require("../modelos/Chofer");
const Usuario = require("../modelos/Usuario"); // Asegúrate de importar el modelo de usuario
const Vehiculo = require("../modelos/Vehiculo"); // importa el modelo Vehiculo

// Registrar un nuevo chofer
router.post("/agregar", async (req, res) => {
  try {
    const nuevoChofer = await Chofer.create(req.body);
    res.status(201).json(nuevoChofer);
  } catch (error) {
    res.status(400).json({ error: "Error al registrar chofer" });
  }
});

// Buscar chofer por usuario_id
router.get("/usuario/:usuario_id", async (req, res) => {
  const chofer = await Chofer.findOne({
    where: { usuario_id: req.params.usuario_id },
  });
  if (!chofer) return res.status(404).json({ error: "Chofer no encontrado" });
  res.json(chofer);
});

// Registrar usuario y chofer juntos
router.post("/registro-completo", async (req, res) => {
  const { nombre, apellido, empresa, numero_unidad, correo, contrasena } =
    req.body;
  try {
    // 1. Crear el usuario
    const nuevoUsuario = await Usuario.create({
      usuario: correo, // puedes usar el correo como usuario
      contrasena,
      rol: "chofer",
      nombre,
      correo,
    });
    // 2. Crear el chofer usando el id del usuario recién creado
    const nuevoChofer = await Chofer.create({
      nombre,
      apellido,
      empresa,
      numero_unidad,
      usuario_id: nuevoUsuario.id,
    });
    // 3. Asignar el chofer al vehículo seleccionado
    const vehiculo = await Vehiculo.findOne({
      where: { numero_vehiculo: numero_unidad },
    });
    if (vehiculo) {
      vehiculo.chofer_id = nuevoChofer.id;
      await vehiculo.save();
    } else {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    res.status(201).json({ usuario: nuevoUsuario, chofer: nuevoChofer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar chofer
router.put("/:id", async (req, res) => {
  try {
    const chofer = await Chofer.findByPk(req.params.id);
    if (!chofer) return res.status(404).json({ error: "Chofer no encontrado" });
    await chofer.update(req.body);
    res.json(chofer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar chofer
router.delete("/:id", async (req, res) => {
  try {
    const chofer = await Chofer.findByPk(req.params.id);
    if (!chofer) return res.status(404).json({ error: "Chofer no encontrado" });
    await chofer.destroy();
    res.json({ mensaje: "Chofer eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
