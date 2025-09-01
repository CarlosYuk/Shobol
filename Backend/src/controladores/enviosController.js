const Pedido = require("../modelos/Pedido");
const Vehiculo = require("../modelos/Vehiculo");
const Usuario = require("../modelos/Usuario");

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