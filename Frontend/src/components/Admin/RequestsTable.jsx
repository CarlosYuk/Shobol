import React, { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { aceptarSolicitud, rechazarSolicitud } from "../../services/api";
import AprobarPedidoModal from "./AprobarPedidoModal";

const RequestsTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSolicitud, setModalSolicitud] = useState(null);

  // Estados para rechazo
  const [solicitudARechazar, setSolicitudARechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [mensaje, setMensaje] = useState(null);

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
      await aceptarSolicitud(solicitud.id);
      setMensaje({ tipo: "exito", texto: "Solicitud aceptada correctamente." });
      cargarSolicitudes();
    } catch {
      setMensaje({ tipo: "error", texto: "Error al aceptar la solicitud." });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      setMensaje({ tipo: "error", texto: "Debe ingresar un motivo." });
      return;
    }
    try {
      await rechazarSolicitud(solicitudARechazar.id, motivoRechazo);
      setMensaje({
        tipo: "exito",
        texto: "Solicitud rechazada correctamente.",
      });
      setSolicitudARechazar(null);
      setMotivoRechazo("");
      cargarSolicitudes();
    } catch {
      setMensaje({ tipo: "error", texto: "Error al rechazar la solicitud." });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  if (loading) return <div className="p-8">Cargando solicitudes...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Solicitudes Pendientes</h2>
      {mensaje && (
        <div
          className={`mb-4 p-2 rounded ${
            mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-600">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Cliente
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Apellido
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Empresa
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Lugar Entrega
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                N° Viajes
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Fecha
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Estado
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Observaciones
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2">{s.id}</td>
                <td className="px-4 py-2">{s.nombreCliente}</td>
                <td className="px-4 py-2">{s.apellido}</td>
                <td className="px-4 py-2">{s.nombreEmpresa}</td>
                <td className="px-4 py-2">{s.lugar_entrega}</td>
                <td className="px-4 py-2">{s.numero_viajes}</td>
                <td className="px-4 py-2">
                  {new Date(s.fecha_solicitud).toLocaleString()}
                </td>
                <td className="px-4 py-2 capitalize">{s.estado}</td>
                <td className="px-4 py-2">{s.observaciones}</td>

                <td className="px-4 py-2">
                  {s.estado === "pendiente" && (
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalSolicitud && (
        <AprobarPedidoModal
          solicitud={modalSolicitud}
          onClose={() => setModalSolicitud(null)}
          onAprobado={cargarSolicitudes}
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
