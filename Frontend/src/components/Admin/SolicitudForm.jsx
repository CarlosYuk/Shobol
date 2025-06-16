// Nuevo archivo: c:\Shobol\Frontend\src\components\Cliente\SolicitudForm.jsx
import React, { useState } from "react";
import ApiService from "../../services/api";

const SolicitudForm = ({ clienteId, onSolicitudCreada }) => {
  const [observaciones, setObservaciones] = useState("");
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createSolicitud({
        cliente_id: clienteId,
        observaciones,
      });
      setObservaciones("");
      if (onSolicitudCreada) onSolicitudCreada();
      alert("Solicitud registrada correctamente");
    } catch (error) {
      alert("Error al registrar la solicitud");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar nueva solicitud</h3>
      <textarea
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        required
      />
      <button type="submit">Enviar Solicitud</button>

      {/* Renderizado de la tabla y botón para aprobar y crear pedido */}
      {solicitudes.map((s) => (
        <tr key={s.id}>
          {/* ...otras columnas... */}
          <td>
            <button onClick={() => setModalSolicitud(s)}>
              Aprobar y crear pedido
            </button>
          </td>
        </tr>
      ))}

      {/* Modal para aprobar pedido */}
      {modalSolicitud && (
        <AprobarPedidoModal
          solicitud={modalSolicitud}
          onClose={() => setModalSolicitud(null)}
          onAprobado={cargarSolicitudes} // función para recargar la tabla
        />
      )}
    </form>
  );
};

export default SolicitudForm;
