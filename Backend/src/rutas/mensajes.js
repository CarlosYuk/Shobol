const express = require("express");
const router = express.Router();
const Mensaje = require("../modelos/Mensaje");

// Crear mensaje
router.post("/", async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    const nuevo = await Mensaje.create({ nombre, email, texto: mensaje });
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar mensaje" });
  }
});

// Obtener mensajes (para admin/gestor)
router.get("/", async (req, res) => {
  const mensajes = await Mensaje.findAll({ order: [["createdAt", "DESC"]] });
  res.json(mensajes);
});

module.exports = router;