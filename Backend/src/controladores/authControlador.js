const Usuario = require("../modelos/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registrar usuario (puedes enviar el rol desde el frontend si lo deseas)
exports.registrar = async (req, res) => {
  try {
    const { usuario, contrasena, nombre, correo, rol = "cliente" } = req.body;
    if (!usuario || !contrasena || !nombre || !correo)
      return res.status(400).json({ mensaje: "Faltan datos." });

    // Verifica si ya existe usuario o correo
    const existe = await Usuario.findOne({ where: { usuario } });
    if (existe)
      return res.status(400).json({ mensaje: "El usuario ya existe." });

    const existeCorreo = await Usuario.findOne({ where: { correo } });
    if (existeCorreo)
      return res.status(400).json({ mensaje: "El correo ya está registrado." });

    // Encripta la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crea el usuario
    const nuevoUsuario = await Usuario.create({
      usuario,
      contrasena: hash,
      nombre,
      correo,
      rol,
    });

    res.status(201).json({ mensaje: "Usuario registrado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el servidor.", error: error.message });
  }
};

// Login: permite login con usuario o correo
exports.login = async (req, res) => {
  console.log("BODY RECIBIDO EN LOGIN:", req.body);
  try {
    const { usuario, correo, contrasena } = req.body;
    if ((!usuario && !correo) || !contrasena)
      return res.status(400).json({ mensaje: "Faltan datos." });

    const where = usuario ? { usuario } : { correo };
    const user = await Usuario.findOne({ where });
    if (!user)
      return res
        .status(400)
        .json({ mensaje: "Usuario/correo o contraseña incorrectos." });

    const valido = await bcrypt.compare(contrasena, user.contrasena);
    if (!valido)
      return res
        .status(400)
        .json({ mensaje: "Usuario/correo o contraseña incorrectos." });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol,
        nombre: user.nombre,
        correo: user.correo,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error en el servidor.", error: error.message });
  }
};
