import React, { useEffect, useState } from "react";
import { getSolicitudesCliente } from "../../services/api";
import { Link } from "react-router-dom";

const MyRequests = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    getSolicitudesCliente().then(setSolicitudes);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mis Solicitudes</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Mensaje / Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2">
                {new Date(s.fecha_solicitud).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                {s.estado === "aprobada" && (
                  <span className="text-green-600 font-semibold">Aceptada</span>
                )}
                {s.estado === "rechazada" && (
                  <span className="text-red-600 font-semibold">Rechazada</span>
                )}
                {s.estado === "pendiente" && (
                  <span className="text-yellow-600 font-semibold">
                    Pendiente
                  </span>
                )}
              </td>
              <td className="border px-4 py-2">
                {s.estado === "aprobada" ? (
                  <button
                    onClick={() => setDetalle(s)}
                    className="text-blue-500 hover:underline"
                  >
                    Ver detalles del pedido
                  </button>
                ) : s.estado === "rechazada" ? (
                  s.mensajeRespuesta
                ) : (
                  <Link to={`/dashboard/seguimiento/${s.id}`}>
                    Ver seguimiento
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalles */}
      {detalle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setDetalle(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 300,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              Detalles de la Solicitud
            </h3>
            <p>
              <b>Fecha Solicitud:</b> {detalle.fecha_solicitud || detalle.fecha}
            </p>
            <p>
              <b>Observaciones:</b> {detalle.observaciones}
            </p>
            <p>
              <b>Estado Solicitud:</b> {detalle.estado}
            </p>
            {/* Mostrar detalles del pedido si existen */}
            {detalle.pedidos && detalle.pedidos.length > 0 && (
              <>
                <hr className="my-2" />
                <h4 className="font-semibold mb-1">Datos del Pedido</h4>
                {detalle.pedidos.map((pedido) => (
                  <div key={pedido.id}>
                    <p>
                      <b>ID Pedido:</b> {pedido.id}
                    </p>
                    <p>
                      <b>Cantidad (ton):</b> {pedido.cantidad_toneladas}
                    </p>
                    <p>
                      <b>Dirección de Entrega:</b> {pedido.direccion_entrega}
                    </p>
                    <p>
                      <b>Fecha de Entrega:</b> {pedido.fecha_entrega}
                    </p>
                    <p>
                      <b>Estado Pedido:</b> {pedido.estado}
                    </p>
                    <p>
                      <b>Mensaje:</b> {pedido.mensaje || "-"}
                    </p>
                    {/* Mostrar detalles del vehículo si existen */}
                    {pedido.vehiculo && (
                      <>
                        <hr className="my-2" />
                        <h4 className="font-semibold mb-1">
                          Vehículo Asignado
                        </h4>
                        <p>
                          <b>Número Vehículo:</b>{" "}
                          {pedido.vehiculo.numero_vehiculo}
                        </p>
                        <p>
                          <b>Placa:</b> {pedido.vehiculo.placa}
                        </p>
                        <p>
                          <b>Modelo:</b> {pedido.vehiculo.modelo}
                        </p>
                        <p>
                          <b>Año:</b> {pedido.vehiculo.anio}
                        </p>
                        <p>
                          <b>Chofer:</b> {pedido.vehiculo.nombre_chofer}
                        </p>
                        <p>
                          <b>Propietario:</b>{" "}
                          {pedido.vehiculo.nombre_propietario}
                        </p>
                        <p>
                          <b>Estado Vehículo:</b> {pedido.vehiculo.estado}
                        </p>
                      </>
                    )}
                    <Link
                      to={`/dashboard/seguimiento/${pedido.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Ver seguimiento
                    </Link>
                  </div>
                ))}
              </>
            )}
            <button
              onClick={() => setDetalle(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
