import React, { useState } from "react";
import ApiService from "../../services/api";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const SolicitudForm = ({ clienteId, onSolicitudCreada }) => {
  const [nombreCliente, setNombreCliente] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [lugarEntrega, setLugarEntrega] = useState("");
  const [numeroViajes, setNumeroViajes] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClTNi7CRWB1KBn-YJXDjUFjAOYq6evRDY", // Reemplaza con tu API KEY
  });

  const handleMapClick = (e) => {
    setLatitud(e.latLng.lat());
    setLongitud(e.latLng.lng());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log({
      cliente_id: clienteId,
      nombreCliente,
      apellido,
      nombreEmpresa,
      lugar_entrega: lugarEntrega,
      numero_viajes: Number(numeroViajes),
      observaciones,
      latitud,
      longitud,
    });
    try {
      await ApiService.createSolicitud({
        cliente_id: clienteId,
        nombreCliente,
        apellido,
        nombreEmpresa,
        lugar_entrega: lugarEntrega,
        numero_viajes: Number(numeroViajes),
        observaciones,
        latitud,
        longitud,
      });
      setNombreCliente("");
      setApellido("");
      setNombreEmpresa("");
      setLugarEntrega("");
      setNumeroViajes(1);
      setObservaciones("");
      setLatitud(null);
      setLongitud(null);
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
      <div>
        <label className="block mb-2 font-semibold">
          Punto de entrega (haz clic en el mapa):
        </label>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: 300 }}
            center={
              latitud && longitud
                ? { lat: latitud, lng: longitud }
                : { lat: -1.67, lng: -78.65 }
            }
            zoom={7}
            onClick={handleMapClick}
          >
            {latitud && longitud && (
              <Marker
                position={{ lat: latitud, lng: longitud }}
              />
            )}
          </GoogleMap>
        )}
        {latitud && longitud && (
          <div className="text-xs mt-2">
            Latitud: {latitud}, Longitud: {longitud}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !latitud || !longitud}
        className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-all duration-300"
      >
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </button>
    </form>
  );
};

export default SolicitudForm;
