import React, { useEffect, useState } from "react";
import ApiService from "../../services/api";
import AprobarPedidoModal from "./AprobarPedidoModal";

const RequestsTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getRequests();
      setSolicitudes(data);
    } catch {
      setSolicitudes([]);
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
      alert("Pedido creado a partir de la solicitud.");
      cargarSolicitudes();
    } catch {
      alert("Error al crear el pedido.");
    }
  };

  if (loading) return <div className="p-8">Cargando solicitudes...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Solicitudes Pendientes</h2>
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
                <td className="px-4 py-2">{s.cliente_id}</td>
                <td className="px-4 py-2">
                  {new Date(s.fecha_solicitud).toLocaleString()}
                </td>
                <td className="px-4 py-2 capitalize">{s.estado}</td>
                <td className="px-4 py-2">{s.observaciones}</td>
                <td className="px-4 py-2">
                  {s.estado === "pendiente" && (
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition"
                      onClick={() => setModalSolicitud(s)}
                    >
                      Aprobar y crear pedido
                    </button>
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
    </div>
  );
};

export default RequestsTable;
