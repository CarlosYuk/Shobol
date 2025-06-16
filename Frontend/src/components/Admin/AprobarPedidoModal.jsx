import React, { useState } from "react";
import ApiService from "../../services/api";

const AprobarPedidoModal = ({ solicitud, onClose, onAprobado }) => {
  const [form, setForm] = useState({
    material: "",
    cantidad_toneladas: "",
    direccion_entrega: "",
    fecha_entrega: "",
    volumen: "",
    tipo_carga: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ApiService.aprobarSolicitud(solicitud.id, form);
      if (onAprobado) onAprobado();
      onClose();
    } catch (err) {
      alert("Error al aprobar y crear el pedido");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg min-w-[350px]">
        <h3 className="text-lg font-bold mb-4">Aprobar y crear pedido</h3>
        <input name="material" placeholder="Material" value={form.material} onChange={handleChange} required className="mb-2 w-full border px-2 py-1 rounded" />
        <input name="cantidad_toneladas" placeholder="Cantidad (toneladas)" value={form.cantidad_toneladas} onChange={handleChange} required type="number" className="mb-2 w-full border px-2 py-1 rounded" />
        <input name="direccion_entrega" placeholder="Dirección de entrega" value={form.direccion_entrega} onChange={handleChange} required className="mb-2 w-full border px-2 py-1 rounded" />
        <input name="fecha_entrega" placeholder="Fecha de entrega" value={form.fecha_entrega} onChange={handleChange} required type="date" className="mb-2 w-full border px-2 py-1 rounded" />
        <input name="volumen" placeholder="Volumen" value={form.volumen} onChange={handleChange} className="mb-2 w-full border px-2 py-1 rounded" />
        <input name="tipo_carga" placeholder="Tipo de carga" value={form.tipo_carga} onChange={handleChange} className="mb-2 w-full border px-2 py-1 rounded" />
        <div className="flex justify-end space-x-2 mt-4">
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded" disabled={loading}>Aprobar</button>
          <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AprobarPedidoModal;