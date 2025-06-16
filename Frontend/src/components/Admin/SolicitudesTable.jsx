import React, { useState, useEffect } from "react";
import AprobarPedidoModal from "./AprobarPedidoModal";
import api from "../../services/api";

function SolicitudesTable() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const cargarSolicitudes = async () => {
    const res = await api.get("/solicitudes");
    setSolicitudes(res.data);
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Observaciones</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.filter(s => s.estado === "pendiente").map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.cliente_id}</td>
              <td>{s.fecha_solicitud}</td>
              <td>{s.estado}</td>
              <td>{s.observaciones}</td>
              <td>
                <button onClick={() => setModalSolicitud(s)}>
                  Aprobar y crear pedido
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalSolicitud && (
        <AprobarPedidoModal
          solicitud={modalSolicitud}
          onClose={() => setModalSolicitud(null)}
          onAprobado={cargarSolicitudes}
        />
      )}
    </div>
  );
}

export default SolicitudesTable;