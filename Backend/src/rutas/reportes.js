const express = require("express");
const router = express.Router();
const reportes = require("../controladores/reporteControlador");

// Usuarios
router.get("/usuarios/excel", reportes.reporteUsuariosExcel);
router.get("/usuarios/pdf", reportes.reporteUsuariosPDF);

// Solicitudes
router.get("/solicitudes/excel", reportes.reporteSolicitudesExcel);
router.get("/solicitudes/pdf", reportes.reporteSolicitudesPDF);

// Vehículos
router.get("/vehiculos/excel", reportes.reporteVehiculosExcel);
router.get("/vehiculos/pdf", reportes.reporteVehiculosPDF);

// Pedidos
router.get("/pedidos/excel", reportes.reportePedidosExcel);
router.get("/pedidos/pdf", reportes.reportePedidosPDF);

module.exports = router;
