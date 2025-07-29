const express = require("express");
const router = express.Router();
const ubicacionController = require("../controladores/ubicacionController");

router.post("/", ubicacionController.guardarUbicacion);
router.get("/:pedido_id", ubicacionController.obtenerUbicacion);

module.exports = router;