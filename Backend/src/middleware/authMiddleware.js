const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
function verificarToken(req, res, next) {
  // El token se envía normalmente en el header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer token'
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no válido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
    req.usuario = usuario; // Guardamos los datos del usuario para usarlos en la ruta
    next();
  });
}

// Middleware para autorizar solo administradores
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores.' });
  }
  next();
}

// Middleware para autorizar solo gestores
function soloGestor(req, res, next) {
  if (req.usuario.rol !== 'gestor') {
    return res.status(403).json({ mensaje: 'Acceso solo para gestores.' });
  }
  next();
}

module.exports = {
  verificarToken,
  soloAdmin,
  soloGestor
};
