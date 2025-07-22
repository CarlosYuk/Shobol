const express = require("express");
const router = express.Router();
const choferControlador = require("../controladores/choferControlador");

// Solo admin/gestor pueden acceder (agrega tu middleware de autenticación/rol si lo necesitas)
router.post("/agregar", choferControlador.registrarChofer);

module.exports = router;
