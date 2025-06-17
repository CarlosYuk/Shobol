const Vehiculo = require("../modelos/Vehiculo");

// Listar vehículos
exports.listar = async (req, res) => {
  const vehiculos = await Vehiculo.findAll();
  res.json(vehiculos);
};

// Crear vehículo (sólo admin o gestor)
exports.crear = async (req, res) => {
  try {
    const { placa, modelo, anio, nombre_chofer, nombre_propietario, estado } = req.body;
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
    const { modelo, anio, nombre_chofer, nombre_propietario, estado } = req.body;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo)
      return res.status(404).json({ mensaje: "Vehículo no encontrado." });

    await vehiculo.update({ modelo, anio, nombre_chofer, nombre_propietario, estado });
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
