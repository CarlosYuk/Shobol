const express = require("express");
const router = express.Router();
const Solicitud = require("../modelos/Solicitud");
const Pedido = require("../modelos/Pedido"); // Asegúrate de tener el modelo de Pedido

// Obtener todas las solicitudes
router.get("/solicitudes", async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll();
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { cliente_id, observaciones } = req.body;
    const nuevaSolicitud = await Solicitud.create({
      cliente_id,
      fecha_solicitud: new Date(),
      estado: "pendiente",
      observaciones,
    });
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la solicitud" });
  }
});

router.put("/:id/aprobar", async (req, res) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    solicitud.estado = "aprobada";
    await solicitud.save();

    // Validar que todos los campos requeridos estén presentes
    const {
      material,
      cantidad_toneladas,
      direccion_entrega,
      fecha_entrega,
      volumen,
      tipo_carga,
    } = req.body;

    if (
      !material ||
      !cantidad_toneladas ||
      !direccion_entrega ||
      !fecha_entrega
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const pedido = await Pedido.create({
      solicitud_id: solicitud.id,
      cliente_id: solicitud.cliente_id,
      material,
      cantidad_toneladas,
      direccion_entrega,
      fecha_entrega,
      volumen,
      tipo_carga,
    });

    res.json({ solicitud, pedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res
      .status(500)
      .json({ error: "Error al aprobar la solicitud y crear el pedido" });
  }
});

// Rechazar solicitud
router.put("/:id/rechazar", async (req, res) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }
    solicitud.estado = "rechazada";
    solicitud.observaciones = req.body.observaciones || "";
    await solicitud.save();
    res.json({ solicitud });
  } catch (error) {
    res.status(500).json({ error: "Error al rechazar la solicitud" });
  }
});

// Obtener solicitudes con filtro opcional por cliente
router.get("/", async (req, res) => {
  // Si quieres filtrar por cliente solo cuando se pasa un parámetro
  const { cliente_id } = req.query;
  let where = {};
  if (cliente_id) where.cliente_id = cliente_id;
  const solicitudes = await Solicitud.findAll({ where });
  res.json(solicitudes);
});

module.exports = router;
