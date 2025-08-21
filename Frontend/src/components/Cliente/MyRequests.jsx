import React, { useEffect, useState } from "react";
import { getSolicitudesCliente } from "../../services/api";
import { Link } from "react-router-dom";

const estadoColor = {
  aprobada: "bg-emerald-100 text-emerald-800",
  rechazada: "bg-red-100 text-red-800",
  pendiente: "bg-yellow-100 text-yellow-800",
  asignado: "bg-blue-100 text-blue-800",
  entregado: "bg-gray-100 text-gray-800",
};

const estadoTexto = {
  aprobada: "Aceptada",
  rechazada: "Rechazada",
  pendiente: "Pendiente",
  asignado: "Asignado",
  entregado: "Entregado",
};

const MyRequests = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    getSolicitudesCliente().then(setSolicitudes);
  }, []);

  // Pedidos pendientes: solicitudes sin pedidos o pedidos en estado pendiente/asignado/aprobada
  const pedidosPendientes = [];
  // Pedidos concretados: pedidos entregados o cancelados/rechazados
  const pedidosConcretados = [];

  solicitudes.forEach((s) => {
    if (!s.pedidos || s.pedidos.length === 0) {
      // Si la solicitud está pendiente o aprobada, va en pendientes
      if (s.estado === "pendiente" || s.estado === "aprobada") {
        pedidosPendientes.push({ solicitud: s });
      } else if (s.estado === "rechazada") {
        pedidosConcretados.push({ solicitud: s });
      }
    } else {
      s.pedidos.forEach((pedido) => {
        if (pedido.estado === "entregado" || pedido.estado === "rechazada") {
          pedidosConcretados.push({ solicitud: s, pedido });
        } else {
          pedidosPendientes.push({ solicitud: s, pedido });
        }
      });
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700 text-center">
        Mis Solicitudes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pedidos Pendientes */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-yellow-700">
            Pedidos Pendientes
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-yellow-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidosPendientes.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No tienes pedidos pendientes.
                    </td>
                  </tr>
                )}
                {pedidosPendientes.map(({ solicitud, pedido }, idx) => (
                  <tr
                    key={pedido ? pedido.id : solicitud.id}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    <td className="border px-4 py-3">
                      {new Date(solicitud.fecha_solicitud).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                          pedido
                            ? estadoColor[pedido.estado]
                            : estadoColor[solicitud.estado]
                        }`}
                      >
                        {pedido
                          ? estadoTexto[pedido.estado] || pedido.estado
                          : estadoTexto[solicitud.estado] || solicitud.estado}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      <button
                        onClick={() =>
                          setDetalle(
                            pedido
                              ? { ...solicitud, pedido }
                              : solicitud
                          )
                        }
                        className="text-yellow-700 hover:underline font-medium"
                      >
                        Ver detalles
                      </button>
                      {pedido && (
                        <Link
                          to={`/dashboard/seguimiento/${pedido.id}`}
                          className="ml-4 text-blue-600 hover:underline font-medium"
                        >
                          Ver seguimiento
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pedidos Concretados */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Pedidos Concretados
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidosConcretados.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No tienes pedidos concretados.
                    </td>
                  </tr>
                )}
                {pedidosConcretados.map(({ solicitud, pedido }, idx) => (
                  <tr
                    key={pedido ? pedido.id : solicitud.id}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    <td className="border px-4 py-3">
                      {new Date(solicitud.fecha_solicitud).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                          pedido
                            ? estadoColor[pedido.estado]
                            : estadoColor[solicitud.estado]
                        }`}
                      >
                        {pedido
                          ? estadoTexto[pedido.estado] || pedido.estado
                          : estadoTexto[solicitud.estado] || solicitud.estado}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      <button
                        onClick={() =>
                          setDetalle(
                            pedido
                              ? { ...solicitud, pedido }
                              : solicitud
                          )
                        }
                        className="text-gray-600 hover:underline font-medium"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {detalle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setDetalle(null)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg min-w-[350px] max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetalle(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              title="Cerrar"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-emerald-700">
              Detalles del Pedido
            </h3>
            <div className="space-y-2">
              <div>
                <b>Fecha Solicitud:</b>{" "}
                {detalle.fecha_solicitud
                  ? new Date(detalle.fecha_solicitud).toLocaleString()
                  : detalle.fecha}
              </div>
              <div>
                <b>Observaciones:</b> {detalle.observaciones}
              </div>
              <div>
                <b>Estado Solicitud:</b>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full font-semibold text-sm ${
                    estadoColor[detalle.estado]
                  }`}
                >
                  {estadoTexto[detalle.estado] || detalle.estado}
                </span>
              </div>
            </div>
            {/* Mostrar detalles del pedido */}
            {detalle.pedido && (
              <>
                <hr className="my-4" />
                <h4 className="font-semibold mb-2 text-emerald-600">
                  Datos del Pedido
                </h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50 mb-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>
                        <b>ID Pedido:</b> {detalle.pedido.id}
                      </div>
                      <div>
                        <b>Cantidad (ton):</b> {detalle.pedido.cantidad_toneladas}
                      </div>
                      <div>
                        <b>Dirección de Entrega:</b> {detalle.pedido.direccion_entrega}
                      </div>
                      <div>
                        <b>Fecha de Entrega:</b> {detalle.pedido.fecha_entrega}
                      </div>
                      <div>
                        <b>Estado Pedido:</b>{" "}
                        <span
                          className={`inline-block px-2 py-1 rounded-full font-semibold text-xs ${estadoColor[detalle.pedido.estado]}`}
                        >
                          {estadoTexto[detalle.pedido.estado] || detalle.pedido.estado}
                        </span>
                      </div>
                      <div>
                        <b>Mensaje:</b> {detalle.pedido.mensaje || "-"}
                      </div>
                    </div>
                    {/* Mostrar detalles del vehículo si existen */}
                    {detalle.pedido.vehiculo && (
                      <div className="mt-3 border-t pt-3">
                        <h4 className="font-semibold mb-1 text-emerald-700">
                          Vehículo Asignado
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div>
                            <b>Número Vehículo:</b>{" "}
                            {detalle.pedido.vehiculo.numero_vehiculo}
                          </div>
                          <div>
                            <b>Placa:</b> {detalle.pedido.vehiculo.placa}
                          </div>
                          <div>
                            <b>Modelo:</b> {detalle.pedido.vehiculo.modelo}
                          </div>
                          <div>
                            <b>Año:</b> {detalle.pedido.vehiculo.anio}
                          </div>
                          <div>
                            <b>Chofer:</b> {detalle.pedido.vehiculo.nombre_chofer}
                          </div>
                          <div>
                            <b>Propietario:</b>{" "}
                            {detalle.pedido.vehiculo.nombre_propietario}
                          </div>
                          <div>
                            <b>Estado Vehículo:</b> {detalle.pedido.vehiculo.estado}
                          </div>
                        </div>
                      </div>
                    )}
                    {detalle.pedido.estado !== "entregado" && (
                      <div className="mt-3">
                        <Link
                          to={`/dashboard/seguimiento/${detalle.pedido.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Ver seguimiento
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {detalle.pedido && detalle.pedido.estado === "no_entregado" && (
              <div className="mt-2 text-red-700 font-semibold">
                Su pedido no fue entregado. Motivo:{" "}
                {detalle.pedido.motivo_no_entregado || "-"}
                <br />
                Pronto se enviará otra unidad con su pedido.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
