const express = require("express");
const router = express.Router();
const pedidoCtrl = require("../controladores/pedidosController");
const { verificarToken } = require("../middleware/authMiddleware");

// Obtener el pedido activo del chofer autenticado (¡debe ir antes de /:id!)
router.get(
  "/activo-chofer",
  verificarToken,
  pedidoCtrl.obtenerPedidoActivoChofer
);

// Asignar vehículo a un pedido
router.put("/:id/asignar-vehiculo", pedidoCtrl.asignarVehiculoAPedido);

// Marcar pedido como entregado
router.put("/:id/entregar", pedidoCtrl.marcarPedidoEntregado);

// Eliminar un pedido
router.delete("/:id", pedidoCtrl.eliminarPedido);

// Obtener todos los pedidos
router.get("/", pedidoCtrl.obtenerPedidos);

// Obtener un pedido por su ID
router.get("/:id", pedidoCtrl.obtenerPedidoPorId);

// Obtener pedidos por chofer ID
router.get("/chofer/:chofer_id", pedidoCtrl.obtenerPedidosPorChofer);

module.exports = router;
