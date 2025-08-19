import React, { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { aceptarSolicitud, rechazarSolicitud } from "../../services/api";
import AprobarPedidoModal from "./AprobarPedidoModal";

const estadoColor = {
  aprobada: "bg-emerald-100 text-emerald-800",
  rechazada: "bg-red-100 text-red-800",
  pendiente: "bg-yellow-100 text-yellow-800",
};

const estadoTexto = {
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  pendiente: "Pendiente",
};

const RequestsTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSolicitud, setModalSolicitud] = useState(null);

  // Estados para rechazo
  const [solicitudARechazar, setSolicitudARechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const mensajeEstilo = (tipo) =>
    tipo === "exito"
      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
      : "bg-red-100 text-red-800 border border-red-300";

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getRequests();
      setSolicitudes(data);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar solicitudes." });
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // División de solicitudes
  const solicitudesPendientes = solicitudes.filter((s) => s.estado === "pendiente");
  const solicitudesProcesadas = solicitudes.filter(
    (s) => s.estado === "aprobada" || s.estado === "rechazada"
  );

  const aprobarSolicitud = async (solicitud) => {
    try {
      await ApiService.createPedido({
        solicitud_id: solicitud.id,
        cantidad_toneladas: 1,
        direccion_entrega: "Por definir",
        fecha_entrega: new Date(),
        estado: "pendiente",
      });
      setMensaje({
        tipo: "exito",
        texto: "Pedido creado a partir de la solicitud.",
      });
      cargarSolicitudes();
    } catch {
      setMensaje({ tipo: "error", texto: "Error al crear el pedido." });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleAceptar = async (solicitud) => {
    try {
      await aprobarSolicitud(solicitud);
      setMensaje("Solicitud aprobada correctamente.");
      cargarSolicitudes();
    } catch (error) {
      setMensaje("Error al aprobar la solicitud.");
    }
  };

  const handleRechazar = async () => {
    try {
      await rechazarSolicitud(solicitudARechazar, motivoRechazo);
      setMensaje("Solicitud rechazada correctamente.");
      setSolicitudARechazar(null);
      setMotivoRechazo("");
      cargarSolicitudes();
    } catch (error) {
      setMensaje("Error al rechazar la solicitud.");
    }
  };

  if (loading) return <div className="p-8">Cargando solicitudes...</div>;

  return (
    <div className="p-8">
      {mensaje && (
        <div
          className={`flex items-center gap-2 mb-4 px-4 py-3 rounded-lg shadow-sm font-semibold transition-all duration-300 ${mensajeEstilo(
            mensaje.tipo || "exito"
          )}`}
        >
          {mensaje.tipo === "exito" ? (
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 9l-6 6M9 9l6 6"
              />
            </svg>
          )}
          <span>{mensaje.texto || mensaje}</span>
        </div>
      )}

      {/* Tabla de solicitudes pendientes */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-blue-700 text-center">
          Solicitudes Pendientes
        </h2>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead>
              <tr className="bg-blue-600 text-white rounded-t-xl">
                <th className="px-4 py-3 text-left rounded-tl-xl">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Apellido</th>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Lugar Entrega</th>
                <th className="px-4 py-3 text-left">N° Viajes</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Observaciones</th>
                <th className="px-4 py-3 text-left rounded-tr-xl">Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesPendientes.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-500">
                    No tienes solicitudes pendientes.
                  </td>
                </tr>
              )}
              {solicitudesPendientes.map((s, idx) => (
                <tr
                  key={s.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="border px-4 py-3">{s.id}</td>
                  <td className="border px-4 py-3">{s.nombreCliente}</td>
                  <td className="border px-4 py-3">{s.apellido}</td>
                  <td className="border px-4 py-3">{s.nombreEmpresa}</td>
                  <td className="border px-4 py-3">{s.lugar_entrega}</td>
                  <td className="border px-4 py-3">{s.numero_viajes}</td>
                  <td className="border px-4 py-3">
                    {new Date(s.fecha_solicitud).toLocaleString()}
                  </td>
                  <td className="border px-4 py-3 capitalize">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                        estadoColor[s.estado] || ""
                      }`}
                    >
                      {estadoTexto[s.estado] || s.estado}
                    </span>
                  </td>
                  <td className="border px-4 py-3">{s.observaciones}</td>
                  <td className="border px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition mb-1"
                        onClick={() => setModalSolicitud(s)}
                      >
                        Aprobar y crear pedido
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                        onClick={() => setSolicitudARechazar(s)}
                      >
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de solicitudes procesadas */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-700 text-center">
          Solicitudes Procesadas
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead>
              <tr className="bg-gray-700 text-white rounded-t-xl">
                <th className="px-4 py-3 text-left rounded-tl-xl">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Apellido</th>
                <th className="px-4 py-3 text-left">Empresa</th>
                <th className="px-4 py-3 text-left">Lugar Entrega</th>
                <th className="px-4 py-3 text-left">N° Viajes</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesProcesadas.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-gray-500">
                    No tienes solicitudes procesadas.
                  </td>
                </tr>
              )}
              {solicitudesProcesadas.map((s, idx) => (
                <tr
                  key={s.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="border px-4 py-3">{s.id}</td>
                  <td className="border px-4 py-3">{s.nombreCliente}</td>
                  <td className="border px-4 py-3">{s.apellido}</td>
                  <td className="border px-4 py-3">{s.nombreEmpresa}</td>
                  <td className="border px-4 py-3">{s.lugar_entrega}</td>
                  <td className="border px-4 py-3">{s.numero_viajes}</td>
                  <td className="border px-4 py-3">
                    {new Date(s.fecha_solicitud).toLocaleString()}
                  </td>
                  <td className="border px-4 py-3 capitalize">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                        estadoColor[s.estado] || ""
                      }`}
                    >
                      {estadoTexto[s.estado] || s.estado}
                    </span>
                  </td>
                  <td className="border px-4 py-3">{s.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalSolicitud && (
        <AprobarPedidoModal
          solicitud={modalSolicitud}
          onClose={() => setModalSolicitud(null)}
          onAprobado={(msg) => {
            setMensaje(msg);
            setModalSolicitud(null);
            cargarSolicitudes();
          }}
        />
      )}

      {/* Modal de rechazo */}
      {solicitudARechazar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Rechazar Solicitud</h3>
            <p className="mb-2">Ingrese el motivo del rechazo:</p>
            <textarea
              className="border rounded w-full p-2 mb-2"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <button
                className="bg-red-700 text-white px-3 py-1 rounded"
                onClick={handleRechazar}
              >
                Enviar motivo y rechazar
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => {
                  setSolicitudARechazar(null);
                  setMotivoRechazo("");
                }}
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

export default RequestsTable;
