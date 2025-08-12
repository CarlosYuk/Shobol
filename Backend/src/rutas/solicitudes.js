const express = require("express");
const router = express.Router();
const Solicitud = require("../modelos/Solicitud");
const Pedido = require("../modelos/Pedido"); // Asegúrate de tener el modelo de Pedido
const solicitudControlador = require("../controladores/solicitudControlador");
const { verificarToken } = require("../middleware/authMiddleware");

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
    const {
      cliente_id,
      nombreCliente,
      apellido,
      nombreEmpresa,
      lugar_entrega,
      numero_viajes,
      observaciones,
      latitud,           // <-- agrega esto
      longitud,          // <-- agrega esto
    } = req.body;
    const nuevaSolicitud = await Solicitud.create({
      cliente_id,
      nombreCliente,
      apellido,
      nombreEmpresa,
      lugar_entrega,
      numero_viajes,
      fecha_solicitud: new Date(),
      estado: "pendiente",
      observaciones,
      mensajeRespuesta: null,
      latitud,           // <-- agrega esto
      longitud,          // <-- agrega esto
    });
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error("Error detallado:", error);
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
    const { material, cantidad_toneladas, fecha_entrega, volumen, tipo_carga } =
      req.body;

    if (
      !material ||
      !cantidad_toneladas ||
      !solicitud.lugar_entrega ||
      !fecha_entrega
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Crear varios pedidos según el número de viajes
    const pedidos = [];
    for (let i = 0; i < solicitud.numero_viajes; i++) {
      const pedido = await Pedido.create({
        solicitud_id: solicitud.id,
        cliente_id: solicitud.cliente_id,
        material,
        cantidad_toneladas,
        direccion_entrega: solicitud.lugar_entrega,
        fecha_entrega,
        volumen,
        tipo_carga,
        latitud_entrega: solicitud.latitud,      // <-- COPIA LA UBICACIÓN
        longitud_entrega: solicitud.longitud,    // <-- COPIA LA UBICACIÓN
      });
      pedidos.push(pedido);
    }

    res.json({ solicitud, pedidos });
  } catch (error) {
    console.error("Error al crear pedidos:", error);
    res
      .status(500)
      .json({ error: "Error al aprobar la solicitud y crear los pedidos" });
  }
});

// Aceptar o rechazar solicitud
router.post("/:id/aceptar", solicitudControlador.aceptarSolicitud);
router.post("/:id/rechazar", solicitudControlador.rechazarSolicitud);
router.get(
  "/cliente",
  verificarToken,
  solicitudControlador.obtenerSolicitudesCliente
); // Para el panel del cliente

// Obtener solicitudes con filtro opcional por cliente
router.get("/", async (req, res) => {
  try {
    // Si usas autenticación, filtra por el cliente
    // const solicitudes = await Solicitud.findAll({ where: { cliente_id: req.user.id } });

    // Si no usas autenticación, trae todas
    const solicitudes = await Solicitud.findAll();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

module.exports = router;
