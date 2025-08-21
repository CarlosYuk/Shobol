import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import MapaUbicacion from "./MapaUbicacion";

const estadoColor = {
  asignado: "bg-blue-100 text-blue-800",
  en_transito: "bg-amber-100 text-amber-800",
  entregado: "bg-gray-100 text-gray-800",
  pendiente: "bg-red-100 text-red-800",
  no_entregado: "bg-red-100 text-red-800",
};

const estadoTexto = {
  asignado: "Asignado",
  en_transito: "En Tránsito",
  entregado: "Entregado",
  pendiente: "Pendiente",
  no_entregado: "No entregado",
};

const ChoferAsignaciones = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origen, setOrigen] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeTipo, setMensajeTipo] = useState("exito");
  const [showNoEntregadoModal, setShowNoEntregadoModal] = useState(false);
  const [motivoNoEntregado, setMotivoNoEntregado] = useState("");
  const ubicacionInterval = useRef(null);

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

  // Nuevo: Marcar como no entregado y enviar motivo
  const marcarNoEntregado = async (pedidoId, motivo) => {
    try {
      await fetch(
        `http://localhost:5000/api/pedidos/${pedidoId}/no-entregado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo }),
        }
      );
      setPedidos((pedidos) =>
        pedidos.map((p) =>
          p.id === pedidoId
            ? { ...p, estado: "no_entregado", motivo_no_entregado: motivo }
            : p
        )
      );
      setMensaje("Pedido marcado como no entregado. El motivo fue enviado.");
      setMensajeTipo("exito");
      setShowNoEntregadoModal(false);
      setMotivoNoEntregado("");
    } catch {
      setMensaje("Error al marcar como no entregado.");
      setMensajeTipo("error");
    }
    setTimeout(() => setMensaje(null), 4000);
  };

  // Enviar ubicación cada 10 segundos mientras el mapa está visible
  useEffect(() => {
    if (mostrarMapa && pedidoSeleccionado) {
      ubicacionInterval.current = setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const ubicacionActual = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            fetch("http://localhost:5000/api/ubicaciones", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                pedido_id: pedidoSeleccionado.id,
                lat: ubicacionActual.lat,
                lng: ubicacionActual.lng,
              }),
            });
            setOrigen(ubicacionActual);
          });
        }
      }, 10000);
    } else {
      clearInterval(ubicacionInterval.current);
    }
    return () => clearInterval(ubicacionInterval.current);
  }, [mostrarMapa, pedidoSeleccionado]);

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
          setDetalle(pedido);
          setMostrarMapa(true);
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

  if (loading)
    return <div className="p-4 text-center">Cargando asignaciones...</div>;

  const pedidosAsignados = pedidos.filter(
    (p) => p.estado !== "entregado" && p.estado !== "no_entregado"
  );
  const pedidosEntregados = pedidos.filter(
    (p) => p.estado === "entregado" || p.estado === "no_entregado"
  );

  return (
    <div className="max-w-6xl mx-auto px-2 py-6">
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
          <span>{mensaje}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Pedidos Asignados */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4 text-blue-700 text-center">
            Pedidos Asignados
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-2 py-2 text-left">Fecha</th>
                  <th className="px-2 py-2 text-left">Estado</th>
                  <th className="px-2 py-2 text-left">Acción</th>
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
                    <td className="border px-2 py-2 break-words">
                      {new Date(pedido.fecha_entrega).toLocaleString()}
                    </td>
                    <td className="border px-2 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full font-semibold text-xs ${
                          estadoColor[pedido.estado]
                        }`}
                      >
                        {estadoTexto[pedido.estado] || pedido.estado}
                      </span>
                    </td>
                    <td className="border px-2 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setDetalle(pedido);
                            setMostrarMapa(false);
                          }}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Ver detalles
                        </button>
                        {pedido.estado !== "entregado" && (
                          <button
                            onClick={() => handleVerRuta(pedido)}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Ver ruta
                          </button>
                        )}
                        <button
                          onClick={() => marcarEntregado(pedido.id)}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          Marcar como entregado
                        </button>
                        <button
                          onClick={() => {
                            setPedidoSeleccionado(pedido);
                            setShowNoEntregadoModal(true);
                          }}
                          className="text-red-600 hover:underline font-medium"
                        >
                          Marcar como no entregado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pedidos Entregados y No Entregados */}
        <div className="flex-1 mt-8 md:mt-0">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">
            Pedidos Concretados
          </h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-2 py-2 text-left">Fecha</th>
                  <th className="px-2 py-2 text-left">Estado</th>
                  <th className="px-2 py-2 text-left">Motivo</th>
                  <th className="px-2 py-2 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidosEntregados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No tienes pedidos concretados.
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
                    <td className="border px-2 py-2 break-words">
                      {new Date(pedido.fecha_entrega).toLocaleString()}
                    </td>
                    <td className="border px-2 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full font-semibold text-xs ${
                          estadoColor[pedido.estado]
                        }`}
                      >
                        {estadoTexto[pedido.estado] || pedido.estado}
                      </span>
                    </td>
                    <td className="border px-2 py-2">
                      {pedido.estado === "no_entregado"
                        ? pedido.motivo_no_entregado || "-"
                        : "-"}
                    </td>
                    <td className="border px-2 py-2">
                      <button
                        onClick={() => {
                          setDetalle(pedido);
                          setMostrarMapa(false);
                        }}
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
          onClick={() => {
            setDetalle(null);
            setMostrarMapa(false);
            setPedidoSeleccionado(null);
          }}
        >
          <div
            className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-2 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setDetalle(null);
                setMostrarMapa(false);
                setPedidoSeleccionado(null);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              title="Cerrar"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-emerald-700">
              Detalles del Pedido
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Detalles a la izquierda */}
              <div className="flex-1 space-y-2 text-sm md:text-base">
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
                  <b>Lugar de entrega:</b>{" "}
                  {detalle.solicitud?.lugar_entrega || "-"}
                </div>
                <div>
                  <b>Estado Pedido:</b>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full font-semibold text-xs md:text-sm ${
                      estadoColor[detalle.estado]
                    }`}
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
                  <b>Dirección de entrega:</b>{" "}
                  {detalle.direccion_entrega || "-"}
                </div>
                <div>
                  <b>Vehículo:</b> {detalle.vehiculo?.numero_vehiculo || "-"}
                </div>
                <div>
                  <b>Placa:</b> {detalle.vehiculo?.placa || "-"}
                </div>
                <div>
                  <b>Propietario:</b>{" "}
                  {detalle.vehiculo?.nombre_propietario || "-"}
                </div>
                {detalle.estado === "no_entregado" && (
                  <div>
                    <b>Motivo no entregado:</b>{" "}
                    {detalle.motivo_no_entregado || "-"}
                  </div>
                )}
              </div>
              {/* Mapa a la derecha, visualmente estético y responsive */}
              {mostrarMapa &&
                origen &&
                detalle.latitud_entrega &&
                detalle.longitud_entrega && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 shadow">
                      <MapaUbicacion
                        origen={origen}
                        destino={{
                          lat: detalle.latitud_entrega,
                          lng: detalle.longitud_entrega,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para marcar como no entregado */}
      {showNoEntregadoModal && pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] max-w-md w-full relative">
            <button
              onClick={() => setShowNoEntregadoModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              title="Cerrar"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-red-700">
              Marcar pedido como no entregado
            </h3>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Motivo del inconveniente
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={motivoNoEntregado}
                onChange={(e) => setMotivoNoEntregado(e.target.value)}
                placeholder="Ejemplo: daño mecánico, accidente, etc."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() =>
                  marcarNoEntregado(pedidoSeleccionado.id, motivoNoEntregado)
                }
                disabled={!motivoNoEntregado.trim()}
              >
                Enviar motivo
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setShowNoEntregadoModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoferAsignaciones;
