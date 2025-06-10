const Asignacion = require("../modelos/Asignacion");

// Listar asignaciones
exports.listar = async (req, res) => {
  try {
    const asignaciones = await Asignacion.findAll();
    res.json(asignaciones);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener asignaciones", error: error.message });
  }
};

// Crear asignación
exports.crear = async (req, res) => {
  try {
    const { pedido_id, ruta_id, vehiculo_id, gestor_id } = req.body;

    const nuevaAsignacion = await Asignacion.create({
      pedido_id,
      ruta_id,
      vehiculo_id,
      gestor_id,
    });

    res.status(201).json(nuevaAsignacion);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear asignación", error: error.message });
  }
};
