const Solicitud = require("../modelos/Solicitud");
const Pedido = require("../modelos/Pedido");

// Aprobar solicitud (y crear pedido)
exports.aprobarSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud) return res.status(404).json({ error: "Solicitud no encontrada" });

    solicitud.estado = "aprobada";
    solicitud.observaciones = req.body.observaciones || null;
    await solicitud.save();

    // Crea el pedido con los datos enviados por el admin (pueden ser editados)
    const pedido = await Pedido.create({
      solicitud_id: solicitud.id,
      cliente_id: solicitud.cliente_id,
      material: req.body.material,
      cantidad_toneladas: req.body.cantidad_toneladas,
      volumen: req.body.volumen,
      tipo_carga: req.body.tipo_carga,
      direccion_entrega: req.body.direccion_entrega,
      fecha_entrega: req.body.fecha_entrega,
      estado: "pendiente",
      // ...otros campos si es necesario
    });

    res.json({ mensaje: "Solicitud aprobada y pedido creado", pedido });
  } catch (error) {
    res.status(500).json({ error: "Error al aprobar solicitud" });
  }
};

// Rechazar solicitud
exports.rechazarSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud) return res.status(404).json({ error: "Solicitud no encontrada" });

    solicitud.estado = "rechazada";
    solicitud.observaciones = req.body.observaciones || null;
    await solicitud.save();

    res.json({ mensaje: "Solicitud rechazada", solicitud });
  } catch (error) {
    res.status(500).json({ error: "Error al rechazar solicitud" });
  }
};