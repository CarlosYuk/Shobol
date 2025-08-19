import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MapaUbicacion from "./MapaUbicacion";

const estadoColor = {
  asignado: "bg-blue-100 text-blue-800",
  en_transito: "bg-amber-100 text-amber-800",
  entregado: "bg-gray-100 text-gray-800",
  pendiente: "bg-red-100 text-red-800",
};

const estadoTexto = {
  asignado: "Asignado",
  en_transito: "En Tránsito",
  entregado: "Entregado",
  pendiente: "Pendiente",
};

const ChoferAsignaciones = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origen, setOrigen] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeTipo, setMensajeTipo] = useState("exito"); // "exito" o "error"

  // Buscar los pedidos asignados a este chofer (usuario)
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/pedidos/chofer/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [user]);

  // Acción para marcar como entregado
  const marcarEntregado = async (pedidoId) => {
    try {
      await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/entregar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId }),
      });
      setPedidos((pedidos) =>
        pedidos.map((p) =>
          p.id === pedidoId ? { ...p, estado: "entregado" } : p
        )
      );
      setMensaje("Pedido marcado como entregado.");
      setMensajeTipo("exito");
    } catch {
      setMensaje("Error al marcar como entregado.");
      setMensajeTipo("error");
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  const handleVerRuta = (pedido) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ubicacionActual = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          fetch("http://localhost:5000/api/ubicaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pedido_id: pedido.id,
              lat: ubicacionActual.lat,
              lng: ubicacionActual.lng,
            }),
          });
          setOrigen(ubicacionActual);
          setPedidoSeleccionado(pedido);
        },
        () => {
          setMensaje("No se pudo obtener la ubicación actual.");
          setMensajeTipo("error");
          setTimeout(() => setMensaje(null), 4000);
        }
      );
    } else {
      setMensaje("Geolocalización no soportada.");
      setMensajeTipo("error");
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  if (loading) return <div>Cargando asignaciones...</div>;

  // Separar pedidos asignados y entregados
  const pedidosAsignados = pedidos.filter(
    (p) => p.estado !== "entregado"
  );
  const pedidosEntregados = pedidos.filter(
    (p) => p.estado === "entregado"
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700 text-center">
        Mis Asignaciones
      </h2>
      {mensaje && (
        <div
          className={`flex items-center gap-2 mb-4 px-4 py-3 rounded-lg shadow-sm font-semibold transition-all duration-300 ${
            mensajeTipo === "exito"
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {mensajeTipo === "exito" ? (
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6M9 9l6 6" />
            </svg>
          )}
          <span>{mensaje}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pedidos Asignados */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-700 text-center">
            Pedidos Asignados
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidosAsignados.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No tienes pedidos asignados.
                    </td>
                  </tr>
                )}
                {pedidosAsignados.map((pedido, idx) => (
                  <tr
                    key={pedido.id}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    <td className="border px-4 py-3">
                      {new Date(pedido.fecha_entrega).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${estadoColor[pedido.estado]}`}
                      >
                        {estadoTexto[pedido.estado] || pedido.estado}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      <button
                        onClick={() => setDetalle(pedido)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Ver detalles
                      </button>
                      {pedido.estado !== "entregado" && (
                        <button
                          onClick={() => handleVerRuta(pedido)}
                          className="ml-4 text-blue-600 hover:underline font-medium"
                        >
                          Ver ruta
                        </button>
                      )}
                      <button
                        onClick={() => marcarEntregado(pedido.id)}
                        className="ml-4 text-emerald-600 hover:underline font-medium"
                      >
                        Marcar como entregado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pedidos Entregados */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">
            Pedidos Entregados
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
                {pedidosEntregados.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No tienes pedidos entregados.
                    </td>
                  </tr>
                )}
                {pedidosEntregados.map((pedido, idx) => (
                  <tr
                    key={pedido.id}
                    className={
                      idx % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    <td className="border px-4 py-3">
                      {new Date(pedido.fecha_entrega).toLocaleString()}
                    </td>
                    <td className="border px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${estadoColor[pedido.estado]}`}
                      >
                        {estadoTexto[pedido.estado] || pedido.estado}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      <button
                        onClick={() => setDetalle(pedido)}
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
                <b>Fecha de Entrega:</b>{" "}
                {detalle.fecha_entrega
                  ? new Date(detalle.fecha_entrega).toLocaleString()
                  : "-"}
              </div>
              <div>
                <b>Cliente:</b> {detalle.solicitud?.nombreCliente || "-"}
              </div>
              <div>
                <b>Empresa:</b> {detalle.solicitud?.nombreEmpresa || "-"}
              </div>
              <div>
                <b>Lugar de entrega:</b> {detalle.solicitud?.lugar_entrega || "-"}
              </div>
              <div>
                <b>Estado Pedido:</b>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full font-semibold text-sm ${estadoColor[detalle.estado]}`}
                >
                  {estadoTexto[detalle.estado] || detalle.estado}
                </span>
              </div>
              <div>
                <b>Material:</b> {detalle.material || "-"}
              </div>
              <div>
                <b>Cantidad (ton):</b> {detalle.cantidad_toneladas || "-"}
              </div>
              <div>
                <b>Dirección de entrega:</b> {detalle.direccion_entrega || "-"}
              </div>
              <div>
                <b>Vehículo:</b> {detalle.vehiculo?.numero_vehiculo || "-"}
              </div>
              <div>
                <b>Placa:</b> {detalle.vehiculo?.placa || "-"}
              </div>
              <div>
                <b>Propietario:</b> {detalle.vehiculo?.nombre_propietario || "-"}
              </div>
            </div>
            {pedidoSeleccionado &&
              pedidoSeleccionado.id === detalle.id &&
              origen && (
                <div className="mt-3">
                  <MapaUbicacion
                    origen={origen}
                    destino={{
                      lat: detalle.latitud_entrega,
                      lng: detalle.longitud_entrega,
                    }}
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoferAsignaciones;
