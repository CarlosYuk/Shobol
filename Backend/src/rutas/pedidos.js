const express = require("express");
const router = express.Router();
const pedidosController = require("../controladores/pedidosController");

router.get("/pedidos", pedidosController.obtenerPedidos);
router.get("/pedidos/:id", pedidosController.obtenerPedidoPorId);
router.post("/pedidos", pedidosController.crearPedido);
router.put("/pedidos/:id", pedidosController.actualizarPedido);
router.put("/pedidos/:id/asignar-vehiculo", pedidosController.asignarVehiculo);
router.put("/pedidos/:id/cambiar-estado", pedidosController.cambiarEstado);
router.delete("/pedidos/:id", pedidosController.eliminarPedido);

module.exports = router;
