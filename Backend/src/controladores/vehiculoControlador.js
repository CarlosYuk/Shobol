const Vehiculo = require("../modelos/Vehiculo");
const Pedido = require("../modelos/Pedido");

// Listar vehículos
exports.listar = async (req, res) => {
  const vehiculos = await Vehiculo.findAll();
  res.json(vehiculos);
};

// Crear vehículo (sólo admin o gestor)
exports.crear = async (req, res) => {
  try {
    const { placa, modelo, anio, nombre_chofer, nombre_propietario, estado } =
      req.body;
    const existe = await Vehiculo.findOne({ where: { placa } });
    if (existe) return res.status(400).json({ mensaje: "La placa ya existe." });

    const nuevo = await Vehiculo.create({
      placa,
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado,
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error en el servidor.", error: error.message });
  }
};

// Editar vehículo (sólo admin o gestor)
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelo, anio, nombre_chofer, nombre_propietario, estado } =
      req.body;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo)
      return res.status(404).json({ mensaje: "Vehículo no encontrado." });

    await vehiculo.update({
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado,
    });
    res.json(vehiculo);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error en el servidor.", error: error.message });
  }
};

// Eliminar vehículo (solo admin)
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo)
      return res.status(404).json({ mensaje: "Vehículo no encontrado." });

    await vehiculo.destroy();
    res.json({ mensaje: "Vehículo eliminado correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error en el servidor.", error: error.message });
  }
};

// Asignar vehículo a pedido
exports.asignarVehiculoAPedido = async (req, res) => {
  const { pedidoId, vehiculoId } = req.body;

  // Asigna el vehículo al pedido
  await Pedido.update(
    { vehiculoId, estado: "asignado" },
    { where: { id: pedidoId } }
  );

  // Marca el vehículo como ocupado
  await Vehiculo.update({ estado: "ocupado" }, { where: { id: vehiculoId } });

  res.json({ mensaje: "Vehículo asignado y marcado como ocupado." });
};

// Marcar pedido como entregado
exports.marcarPedidoEntregado = async (req, res) => {
  const { pedidoId } = req.body;

  // Cambia el estado del pedido
  await Pedido.update({ estado: "entregado" }, { where: { id: pedidoId } });

  // Busca el pedido para obtener el vehículo asignado
  const pedido = await Pedido.findByPk(pedidoId);

  if (pedido && pedido.vehiculoId) {
    // Marca el vehículo como disponible
    await Vehiculo.update(
      { estado: "disponible" },
      { where: { id: pedido.vehiculoId } }
    );
  }

  res.json({ mensaje: "Pedido entregado y vehículo liberado." });
};

// Obtener vehículos disponibles
exports.obtenerVehiculosDisponibles = async (req, res) => {
  const vehiculos = await Vehiculo.findAll({ where: { estado: "disponible" } });
  res.json(vehiculos);
};
