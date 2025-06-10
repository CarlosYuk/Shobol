const Solicitud = require("../modelos/Solicitud");

// Listar solicitudes
exports.listar = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll();
    res.json(solicitudes);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener solicitudes", error: error.message });
  }
};

// Crear solicitud
exports.crear = async (req, res) => {
  try {
    const { cliente_id, estado, observaciones } = req.body;

    const nuevaSolicitud = await Solicitud.create({
      cliente_id,
      estado,
      observaciones,
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear solicitud", error: error.message });
  }
};

// Editar solicitud
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, observaciones } = req.body;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud)
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    await solicitud.update({ estado, observaciones });
    res.json(solicitud);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar solicitud", error: error.message });
  }
};

// Eliminar solicitud
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud)
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    await solicitud.destroy();
    res.json({ mensaje: "Solicitud eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar solicitud", error: error.message });
  }
};
