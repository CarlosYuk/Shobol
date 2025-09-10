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

// Eliminar mensaje
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const eliminado = await Mensaje.destroy({ where: { id } });
    if (eliminado) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Mensaje no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar mensaje" });
  }
});

module.exports = router;