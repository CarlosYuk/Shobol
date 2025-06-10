const Reporte = require("../modelos/Reporte");

// Listar reportes
exports.listar = async (req, res) => {
  try {
    const reportes = await Reporte.findAll();
    res.json(reportes);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener reportes", error: error.message });
  }
};

// Crear reporte
exports.crear = async (req, res) => {
  try {
    const { tipo, formato } = req.body;

    const nuevoReporte = await Reporte.create({
      tipo,
      formato,
    });

    res.status(201).json(nuevoReporte);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear reporte", error: error.message });
  }
};
