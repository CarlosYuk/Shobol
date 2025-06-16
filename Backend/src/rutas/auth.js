const express = require("express");
const router = express.Router();
const authControlador = require("../controladores/authControlador");
const { verificarToken } = require("../middleware/authMiddleware");

router.post("/registro", authControlador.registrar);
router.post("/login", authControlador.login);
router.get("/usuarios", verificarToken, authControlador.listarUsuarios);

module.exports = router;
