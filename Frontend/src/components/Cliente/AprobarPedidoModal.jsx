import React, { useState } from "react";
import api from "../api"; // Ajusta la ruta según tu proyecto

function AprobarPedidoModal({ solicitud, onClose, onAprobado }) {
  const [form, setForm] = useState({
    material: "",
    cantidad_toneladas: "",
    direccion_entrega: "",
    fecha_entrega: "",
    volumen: "",
    tipo_carga: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/solicitudes/${solicitud.id}/aprobar`, form);
      onAprobado();
      onClose();
    } catch (err) {
      alert("Error al aprobar y crear el pedido");
    }
    setLoading(false);
  };

  const rechazarSolicitud = async (solicitud) => {
    const observaciones = prompt("Motivo del rechazo:");
    if (!observaciones) return;
    try {
      await api.put(`/solicitudes/${solicitud.id}/rechazar`, { observaciones });
      // Recarga la lista de solicitudes
    } catch (err) {
      alert("Error al rechazar la solicitud");
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content">
        <h2>Aprobar y crear pedido</h2>
        <input
          name="material"
          placeholder="Material"
          value={form.material}
          onChange={handleChange}
          required
        />
        <input
          name="cantidad_toneladas"
          placeholder="Cantidad (toneladas)"
          value={form.cantidad_toneladas}
          onChange={handleChange}
          required
          type="number"
        />
        <input
          name="direccion_entrega"
          placeholder="Dirección de entrega"
          value={form.direccion_entrega}
          onChange={handleChange}
          required
        />
        <input
          name="fecha_entrega"
          placeholder="Fecha de entrega"
          value={form.fecha_entrega}
          onChange={handleChange}
          required
          type="date"
        />
        <input
          name="volumen"
          placeholder="Volumen"
          value={form.volumen}
          onChange={handleChange}
        />
        <input
          name="tipo_carga"
          placeholder="Tipo de carga"
          value={form.tipo_carga}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          Aprobar y crear pedido
        </button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default AprobarPedidoModal;
