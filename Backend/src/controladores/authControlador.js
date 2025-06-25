const Usuario = require("../modelos/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// Registrar usuario (puedes enviar el rol desde el frontend si lo deseas)
exports.registrar = async (req, res) => {
  try {
    const { usuario, nombre, correo, contrasena, rol } = req.body;
    // Hashea la contraseña UNA SOLA VEZ
    const hash = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await Usuario.create({
      usuario,
      nombre,
      correo,
      contrasena,
      rol: rol || "cliente",
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Login: permite login con usuario o correo
exports.login = async (req, res) => {
  console.log("BODY RECIBIDO EN LOGIN:", req.body);
  const usuario = await Usuario.findOne({ where: { correo: req.body.correo } });
  console.log("Usuario encontrado:", usuario ? usuario.dataValues : null);
  if (!usuario) return res.status(401).json({ error: "Usuario no encontrado" });

  console.log("Contraseña enviada:", req.body.contrasena);
  console.log("Hash en BD:", usuario.contrasena);

  const valido = await bcrypt.compare(req.body.contrasena, usuario.contrasena);
  console.log("Contraseña válida:", valido);
  if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol, usuario: usuario.usuario },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    mensaje: "Inicio de sesión exitoso.",
    token,
    usuario: {
      id: usuario.id,
      usuario: usuario.usuario,
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
    },
  });
};

// Listar usuarios (admin ve todos, gestor solo clientes)
exports.listarUsuarios = async (req, res) => {
  try {
    const { rol } = req.usuario; // <--- aquí
    let where = {};
    if (rol === "gestor") where = { rol: "cliente" };
    // Admin ve todos
    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ["contrasena"] },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios." });
  }
};

exports.solicitarRecuperacion = async (req, res) => {
  const { correo } = req.body;
  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) return res.json({ mensaje: "Si el correo existe, recibirás instrucciones." });

  // Genera token único y fecha de expiración
  const token = crypto.randomBytes(32).toString("hex");
  usuario.tokenRecuperacion = token;
  usuario.tokenExpira = Date.now() + 1000 * 60 * 60; // 1 hora
  await usuario.save();

  // Envía email (configura tu transporter real)
  const transporter = nodemailer.createTransport({ /* ... */ });
  await transporter.sendMail({
    to: correo,
    subject: "Recupera tu contraseña",
    text: `Haz clic aquí para restablecer tu contraseña: http://localhost:5173/restablecer-contrasena?token=${token}`
  });

  res.json({ mensaje: "Si el correo existe, recibirás instrucciones." });
};

exports.restablecerContrasena = async (req, res) => {
  const { token, contrasena } = req.body;
  const usuario = await Usuario.findOne({
    where: {
      tokenRecuperacion: token,
      tokenExpira: { [Sequelize.Op.gt]: Date.now() }
    }
  });
  if (!usuario) return res.status(400).json({ error: "Token inválido o expirado" });

  usuario.contrasena = contrasena; // El modelo la hasheará
  usuario.tokenRecuperacion = null;
  usuario.tokenExpira = null;
  await usuario.save();

  res.json({ mensaje: "Contraseña restablecida" });
};
