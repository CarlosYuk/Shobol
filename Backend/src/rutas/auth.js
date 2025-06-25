const express = require("express");
const router = express.Router();
const authControlador = require("../controladores/authControlador");

router.post("/registro", authControlador.registrar);
router.post("/login", authControlador.login);
router.get("/usuarios", authControlador.listarUsuarios);
router.post("/recuperar", authControlador.solicitarRecuperacion);

module.exports = router;
