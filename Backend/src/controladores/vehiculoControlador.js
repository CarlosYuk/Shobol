const Vehiculo = require("../modelos/Vehiculo");
const Pedido = require("../modelos/Pedido");
const Chofer = require("../modelos/Chofer");

// Listar vehículos
exports.listar = async (req, res) => {
  const vehiculos = await Vehiculo.findAll();
  res.json(vehiculos);
};

// Crear vehículo (sólo admin o gestor)
exports.crear = async (req, res) => {
  console.log("Entrando a crear vehículo");
  console.log("Body recibido:", req.body);
  try {
    const {
      placa,
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado,
      numero_vehiculo,
    } = req.body;
    const existe = await Vehiculo.findOne({ where: { placa } });
    if (existe) return res.status(400).json({ mensaje: "La placa ya existe." });

    const nuevo = await Vehiculo.create({
      placa,
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado,
      numero_vehiculo,
    });
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    res
      .status(500)
      .json({ error: "Error al crear vehículo", detalle: error.message });
  }
};

// Editar vehículo (sólo admin o gestor)
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado,
      numero_vehiculo,
    } = req.body;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo)
      return res.status(404).json({ mensaje: "Vehículo no encontrado." });

    await vehiculo.update({
      modelo,
      anio,
      nombre_chofer,
      nombre_propietario,
      estado,
      numero_vehiculo, // <-- agrega este campo
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

  // Busca el vehículo y su chofer
  const vehiculo = await Vehiculo.findByPk(vehiculoId);
  if (!vehiculo) return res.status(404).json({ mensaje: "Vehículo no encontrado." });

  // Asigna el vehículo y el chofer al pedido
  await Pedido.update(
    { vehiculo_id: vehiculoId, chofer_id: vehiculo.chofer_id, estado: "asignado" },
    { where: { id: pedidoId } }
  );

  // Marca el vehículo como ocupado
  await Vehiculo.update({ estado: "ocupado" }, { where: { id: vehiculoId } });

  res.json({ mensaje: "Vehículo y chofer asignados y marcados como ocupados." });
};

// Marcar pedido como entregado
exports.marcarPedidoEntregado = async (req, res) => {
  const { pedidoId } = req.body;

  // Cambia el estado del pedido
  await Pedido.update({ estado: "entregado" }, { where: { id: pedidoId } });

  // Busca el pedido para obtener el vehículo asignado
  const pedido = await Pedido.findByPk(pedidoId);

  if (pedido && pedido.vehiculo_id) {
    // <-- usa vehiculo_id
    // Marca el vehículo como disponible
    await Vehiculo.update(
      { estado: "disponible" },
      { where: { id: pedido.vehiculo_id } } // <-- usa vehiculo_id
    );
  }

  res.json({ mensaje: "Pedido entregado y vehículo liberado." });
};

// Obtener vehículos disponibles
exports.obtenerVehiculosDisponibles = async (req, res) => {
  const vehiculos = await Vehiculo.findAll({ where: { estado: "disponible" } });
  res.json(vehiculos);
};

exports.obtenerUnidadesDisponibles = async (req, res) => {
  try {
    const unidades = await Vehiculo.findAll({
      where: { chofer_id: null },
      attributes: ["id", "numero_vehiculo"],
    });
    res.json(unidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener unidades disponibles" });
  }
};

// Obtener todos los vehículos
exports.obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los vehículos" });
  }
};
