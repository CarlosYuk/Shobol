// Nuevo archivo: c:\Shobol\Frontend\src\components\Cliente\SolicitudForm.jsx
import React, { useState } from "react";
import ApiService from "../../services/api";

const SolicitudForm = ({ clienteId, onSolicitudCreada }) => {
  const [nombreCliente, setNombreCliente] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [numeroViajes, setNumeroViajes] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createSolicitud({
        cliente_id: clienteId,
        nombreCliente,
        apellido,
        nombreEmpresa,
        lugar_entrega: lugarEntrega,
        numero_viajes: Number(numeroViajes),
        observaciones,
      });
      setNombreCliente("");
      setApellido("");
      setNombreEmpresa("");
      setLugarEntrega("");
      setNumeroViajes(1);
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
      <input
        type="text"
        placeholder="Nombre"
        value={nombreCliente}
        onChange={(e) => setNombreCliente(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Nombre de la empresa"
        value={nombreEmpresa}
        onChange={(e) => setNombreEmpresa(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Lugar de entrega"
        value={lugarEntrega}
        onChange={(e) => setLugarEntrega(e.target.value)}
        required
      />
      <input
        type="number"
        min={1}
        placeholder="Número de viajes"
        value={numeroViajes}
        onChange={(e) => setNumeroViajes(e.target.value)}
        required
      />
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
            {s.estado === "aprobada" ? (
              <span className="text-green-600 font-semibold">
                {s.mensajeRespuesta || "Solicitud aprobada"}
              </span>
            ) : s.estado === "rechazada" ? (
              <span className="text-red-600 font-semibold">
                {s.mensajeRespuesta || "Solicitud rechazada"}
              </span>
            ) : (
              <span className="text-amber-600 font-semibold">Pendiente</span>
            )}
          </td>
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
