const Pedido = require("../modelos/Pedido");
const Vehiculo = require("../modelos/Vehiculo");
const Usuario = require("../modelos/Usuario");
const moment = require("moment");

exports.enviosPorCliente = async (req, res) => {
  try {
    if (!["administrador", "gestor"].includes(req.usuario.rol)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const clienteId = req.params.id;
    // Busca el cliente
    const cliente = await Usuario.findByPk(clienteId);
    if (!cliente || cliente.rol !== "cliente") {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    // Busca los pedidos del cliente
    const pedidos = await Pedido.findAll({
      where: { cliente_id: clienteId },
      include: [
        {
          model: Vehiculo,
          as: "vehiculo",
          attributes: ["numero_vehiculo", "placa", "modelo"],
        },
      ],
      order: [["fecha_entrega", "DESC"]],
    });
    res.json({
      cliente: { id: cliente.id, nombre: cliente.nombre, correo: cliente.correo },
      cantidad_viajes: pedidos.length,
      viajes: pedidos,
    });
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener los envíos" });
  }
};

exports.enviosPorClientePorSemana = async (req, res) => {
  try {
    if (!["administrador", "gestor"].includes(req.usuario.rol)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    const clienteId = req.params.id;
    const cliente = await Usuario.findByPk(clienteId);
    if (!cliente || cliente.rol !== "cliente") {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    const pedidos = await Pedido.findAll({
      where: { cliente_id: clienteId },
      include: [
        {
          model: Vehiculo,
          as: "vehiculo",
          attributes: ["numero_vehiculo", "placa", "modelo"],
        },
      ],
      order: [["fecha_entrega", "ASC"]],
    });

    // Agrupar por semana
    const agrupados = {};
    pedidos.forEach((p) => {
      const fecha = moment(p.fecha_entrega);
      const semana = fecha.isoWeek();
      const año = fecha.year();
      const key = `Semana ${semana} (${fecha.startOf("isoWeek").format(
        "DD/MM"
      )} - ${fecha.endOf("isoWeek").format("DD/MM")}) ${año}`;
      if (!agrupados[key]) agrupados[key] = [];
      agrupados[key].push(p);
    });

    res.json({
      cliente: { id: cliente.id, nombre: cliente.nombre, correo: cliente.correo },
      semanas: agrupados,
    });
  } catch (error) {
    res.status(500).json({ error: "No se pudo agrupar los pedidos" });
  }
};