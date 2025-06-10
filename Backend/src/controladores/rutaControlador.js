const Ruta = require("../modelos/Ruta");

// Listar rutas
exports.listar = async (req, res) => {
  try {
    const rutas = await Ruta.findAll();
    res.json(rutas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener rutas", error: error.message });
  }
};

// Crear ruta
exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion, origen, destino, distancia_km } = req.body;

    const nuevaRuta = await Ruta.create({
      nombre,
      descripcion,
      origen,
      destino,
      distancia_km,
    });

    res.status(201).json(nuevaRuta);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear ruta", error: error.message });
  }
};

// Editar ruta
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, origen, destino, distancia_km } = req.body;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) return res.status(404).json({ mensaje: "Ruta no encontrada" });

    await ruta.update({ nombre, descripcion, origen, destino, distancia_km });
    res.json(ruta);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar ruta", error: error.message });
  }
};

// Eliminar ruta
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const ruta = await Ruta.findByPk(id);
    if (!ruta) return res.status(404).json({ mensaje: "Ruta no encontrada" });

    await ruta.destroy();
    res.json({ mensaje: "Ruta eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar ruta", error: error.message });
  }
};
