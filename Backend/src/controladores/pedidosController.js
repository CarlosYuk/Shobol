const Pedido = require("../modelos/Pedido");
const Vehiculo = require("../modelos/Vehiculo");

// Obtener todos los pedidos
exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    console.error("Error en obtenerPedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

// Obtener un pedido por ID
exports.obtenerPedidoPorId = async (req, res) => {
  const id = req.params.id;
  // Solo acepta números enteros positivos y no vacíos
  if (!id || !/^\d+$/.test(id)) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }
  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(pedido);
  } catch (error) {
    console.error("Error en obtenerPedidoPorId:", error);
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

    // Si el pedido tenía un vehículo asignado, libéralo
    if (pedido.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(pedido.vehiculo_id);
      if (vehiculo && vehiculo.estado === "ocupado") {
        vehiculo.estado = "disponible";
        await vehiculo.save();
      }
    }

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

    const vehiculo = await Vehiculo.findByPk(req.body.vehiculo_id);
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });
    if (vehiculo.estado !== "disponible") {
      return res.status(400).json({ error: "Vehículo no disponible" });
    }

    pedido.vehiculo_id = vehiculo.id;
    pedido.estado = "asignado";
    await pedido.save();

    vehiculo.estado = "ocupado";
    await vehiculo.save();

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

    // Si el pedido se entrega, liberar el vehículo
    if (req.body.estado === "entregado" && pedido.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(pedido.vehiculo_id);
      if (vehiculo) {
        vehiculo.estado = "disponible";
        await vehiculo.save();
      }
    }

    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: "Error al cambiar estado" });
  }
};

// Asignar vehículo a un pedido (nueva función)
exports.asignarVehiculoAPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

    const vehiculo = await Vehiculo.findByPk(req.body.vehiculo_id);
    if (!vehiculo) return res.status(404).json({ error: "Vehículo no encontrado" });

    if (vehiculo.estado !== "disponible") {
      return res.status(400).json({ error: "Vehículo no disponible" });
    }

    // LIBERAR VEHÍCULO ANTERIOR SI EXISTE
    if (pedido.vehiculo_id && pedido.vehiculo_id !== vehiculo.id) {
      const vehiculoAnterior = await Vehiculo.findByPk(pedido.vehiculo_id);
      if (vehiculoAnterior && vehiculoAnterior.estado === "ocupado") {
        vehiculoAnterior.estado = "disponible";
        await vehiculoAnterior.save();
      }
    }

    // Asignar vehículo y cambiar estados
    pedido.vehiculo_id = vehiculo.id;
    pedido.estado = "asignado";
    await pedido.save();

    vehiculo.estado = "ocupado";
    await vehiculo.save();

    res.json({ mensaje: "Vehículo asignado correctamente", pedido });
  } catch (error) {
    res.status(400).json({ error: "Error al asignar vehículo" });
  }
};

// Marcar pedido como entregado (nueva función)
exports.marcarPedidoEntregado = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });

    pedido.estado = "entregado";
    await pedido.save();

    // Liberar vehículo si estaba asignado
    if (pedido.vehiculo_id) {
      const vehiculo = await Vehiculo.findByPk(pedido.vehiculo_id);
      if (vehiculo) {
        vehiculo.estado = "disponible";
        await vehiculo.save();
      }
    }

    res.json({ mensaje: "Pedido entregado y vehículo liberado", pedido });
  } catch (error) {
    res.status(400).json({ error: "Error al marcar como entregado" });
  }
};
