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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-2xl font-bold mb-4 text-emerald-700 text-center">
        Registrar nueva solicitud
      </h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nombreCliente}
        onChange={(e) => setNombreCliente(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <input
        type="text"
        placeholder="Nombre de la empresa"
        value={nombreEmpresa}
        onChange={(e) => setNombreEmpresa(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <input
        type="text"
        placeholder="Lugar de entrega"
        value={lugarEntrega}
        onChange={(e) => setLugarEntrega(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <input
        type="number"
        min={1}
        placeholder="Número de viajes"
        value={numeroViajes}
        onChange={(e) => setNumeroViajes(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <textarea
        placeholder="Observaciones"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-emerald-500 focus:border-emerald-500"
      />
      <br />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-all duration-300"
      >
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </form>
  );
};

export default SolicitudForm;
