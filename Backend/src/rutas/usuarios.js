// filepath: c:\Shobol\Backend\src\rutas\usuarios.js
const express = require("express");
const router = express.Router();
const Usuario = require("../modelos/Usuario");

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear un usuario
router.post("/usuarios", async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Actualizar un usuario
router.put("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    await usuario.update(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Eliminar un usuario
router.delete("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    await usuario.destroy();
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;