// Nuevo archivo: c:\Shobol\Frontend\src\components\Cliente\SolicitudForm.jsx
import React, { useState } from "react";
import ApiService from "../../services/api";

const SolicitudForm = ({ clienteId, onSolicitudCreada }) => {
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
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
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </form>
  );
};

export default SolicitudForm;
