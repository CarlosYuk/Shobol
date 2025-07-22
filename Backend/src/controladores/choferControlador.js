const Usuario = require("../modelos/Usuario");
const Chofer = require("../modelos/Chofer");
const Vehiculo = require("../modelos/Vehiculo"); // Asegúrate de tener este modelo
const bcrypt = require("bcrypt");

exports.registrarChofer = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      empresa,
      numero_unidad,
      correo,
      contrasena,
      email,
      password
    } = req.body;

    const correoFinal = correo || email;
    const contrasenaFinal = contrasena || password;

    if (!correoFinal || !contrasenaFinal) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    // 1. Busca el vehículo por número de unidad
    const vehiculo = await Vehiculo.findOne({ where: { numero_vehiculo: numero_unidad } });
    if (!vehiculo) {
      return res.status(400).json({ error: "El vehículo no existe" });
    }

    // 2. Crea el usuario
    const usuario = await Usuario.create({
      usuario: correoFinal,
      contrasena: contrasenaFinal,
      rol: "chofer",
      nombre,
      correo: correoFinal,
    });

    // 3. Crea el chofer vinculado al usuario y al vehículo
    const chofer = await Chofer.create({
      nombre,
      apellido,
      empresa,
      numero_unidad,
      usuario_id: usuario.id,
      vehiculo_id: vehiculo.id
    });

    // 4. (Opcional) Actualiza el vehículo para asignarle el chofer
    await vehiculo.update({ chofer_id: chofer.id });

    res.status(201).json({ mensaje: "Chofer registrado y vinculado a la unidad exitosamente", chofer });
  } catch (error) {
    console.error("Error al registrar chofer:", error);
    res.status(500).json({ error: "Error al registrar chofer", detalle: error.message });
  }
};
