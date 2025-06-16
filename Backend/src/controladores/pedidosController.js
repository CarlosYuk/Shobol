const Pedido = require("../modelos/Pedido");

// Obtener todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
};

// Obtener un pedido por ID
exports.obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el pedido" });
  }
};

// Crear un pedido
exports.crearPedido = async (req, res) => {
  try {
    const nuevoPedido = await Pedido.create(req.body);
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el pedido" });
  }
};

// Actualizar un pedido
exports.actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    await pedido.update(req.body);
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el pedido" });
  }
};

// Eliminar un pedido
exports.eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    await pedido.destroy();
    res.json({ mensaje: "Pedido eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el pedido" });
  }
};

// Asignar vehículo a un pedido
exports.asignarVehiculo = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    pedido.vehiculo_id = req.body.vehiculo_id;
    pedido.estado = "asignado";
    await pedido.save();
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: "Error al asignar vehículo" });
  }
};

// Cambiar estado de un pedido
exports.cambiarEstado = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    pedido.estado = req.body.estado;
    await pedido.save();
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: "Error al cambiar estado" });
  }
};
