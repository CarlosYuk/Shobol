/* const Carga = require("../modelos/Carga");

// Listar cargas
exports.listar = async (req, res) => {
  try {
    const cargas = await Carga.findAll();
    res.json(cargas);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener cargas", error: error.message });
  }
};

// Crear carga
exports.crear = async (req, res) => {
  try {
    const { descripcion, peso_kg, volumen_m3 } = req.body;

    const nuevaCarga = await Carga.create({
      descripcion,
      peso_kg,
      volumen_m3,
    });

    res.status(201).json(nuevaCarga);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear carga", error: error.message });
  }
};

// Editar carga
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, peso_kg, volumen_m3 } = req.body;

    const carga = await Carga.findByPk(id);
    if (!carga) return res.status(404).json({ mensaje: "Carga no encontrada" });

    await carga.update({ descripcion, peso_kg, volumen_m3 });
    res.json(carga);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar carga", error: error.message });
  }
};

// Eliminar carga
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const carga = await Carga.findByPk(id);
    if (!carga) return res.status(404).json({ mensaje: "Carga no encontrada" });

    await carga.destroy();
    res.json({ mensaje: "Carga eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar carga", error: error.message });
  }
};
 */