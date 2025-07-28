const Solicitud = require("../modelos/Solicitud");
const Pedido = require("../modelos/Pedido");
const Vehiculo = require("../modelos/Vehiculo");

// Listar solicitudes
exports.listar = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll();
    res.json(solicitudes);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener solicitudes", error: error.message });
  }
};

// Crear solicitud
exports.crear = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // <-- Agrega esto
    const clienteId = req.user.id;
    const {
      nombreCliente,
      apellido,
      nombreEmpresa,
      lugar_entrega,
      numero_viajes,
      observaciones,
    } = req.body;
    const solicitud = await Solicitud.create({
      cliente_id: clienteId,
      nombreCliente,
      apellido,
      nombreEmpresa,
      lugar_entrega,
      numero_viajes,
      fecha_solicitud: new Date(),
      estado: "pendiente",
      observaciones,
      mensajeRespuesta: null, // Siempre null al crear
    });
    res.status(201).json(solicitud);
  } catch (error) {
    console.error("Error detallado:", error); // Esto imprime el error real en la consola
    res.status(500).json({ error: "Error al crear solicitud" });
  }
};

// Editar solicitud
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud)
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    await solicitud.update({ estado, observaciones });
    res.json(solicitud);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar solicitud", error: error.message });
  }
};

// Eliminar solicitud
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud)
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    await solicitud.destroy();
    res.json({ mensaje: "Solicitud eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar solicitud", error: error.message });
  }
};

// Aceptar solicitud
exports.aceptarSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud)
      return res.status(404).json({ error: "Solicitud no encontrada" });

    solicitud.estado = "aprobada";
    solicitud.mensajeRespuesta = "¡Tu solicitud ha sido aceptada!";
    await solicitud.save();

    res.json({ mensaje: "Solicitud aceptada", solicitud });
  } catch (error) {
    res.status(500).json({ error: "Error al aceptar solicitud" });
  }
};

// Rechazar solicitud
exports.rechazarSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);
    if (!solicitud)
      return res.status(404).json({ error: "Solicitud no encontrada" });

    solicitud.estado = "rechazada";
    solicitud.mensajeRespuesta = req.body.motivo || "Solicitud rechazada";
    await solicitud.save();

    res.json({ mensaje: "Solicitud rechazada", solicitud });
  } catch (error) {
    res.status(500).json({ error: "Error al rechazar solicitud" });
  }
};

// Listar solicitudes por cliente (para el panel del cliente)
exports.listarPorCliente = async (req, res) => {
  try {
    const clienteId = req.usuario.id; // <-- Aquí usas el id del usuario autenticado
    const solicitudes = await Solicitud.findAll({
      where: { cliente_id: clienteId },
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
};

// Obtener solicitudes con detalles del cliente, pedido y vehículo
exports.obtenerSolicitudesCliente = async (req, res) => {
  try {
    const clienteId = req.user?.id || req.usuario?.id;
    const solicitudes = await Solicitud.findAll({
      where: { cliente_id: clienteId },
      include: [
        {
          model: Pedido,
          as: "pedidos", // <-- Debe ser plural, igual que en asociaciones.js
          include: [
            {
              model: Vehiculo,
              as: "vehiculo",
            },
          ],
        },
      ],
    });
    res.json(solicitudes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener solicitudes", detalle: error.message });
  }
};
