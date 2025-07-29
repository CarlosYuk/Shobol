const Ubicacion = require("../modelos/Ubicacion");

exports.guardarUbicacion = async (req, res) => {
  console.log("Datos recibidos para guardar ubicación:", req.body); // <-- Agrega esto
  const { pedido_id, lat, lng } = req.body;
  if (!pedido_id || !lat || !lng) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  try {
    // upsert: actualiza si existe, crea si no
    await Ubicacion.upsert({ pedido_id, lat, lng, updatedAt: new Date() });
    res.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar ubicación:", error); // <-- Agrega esto
    res.status(500).json({ error: "Error al guardar ubicación" });
  }
};

exports.obtenerUbicacion = async (req, res) => {
  try {
    const pedido_id = parseInt(req.params.pedido_id, 10);
    if (isNaN(pedido_id)) {
      return res.status(400).json({ error: "ID de pedido inválido" });
    }
    const ubicacion = await Ubicacion.findOne({ where: { pedido_id } });
    res.json(ubicacion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ubicación" });
  }
};