import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import ApiService from "../../services/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const SeguimientoPedido = ({ pedidoId }) => {
  const [posicion, setPosicion] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClTNi7CRWB1KBn-YJXDjUFjAOYq6evRDY", // Reemplaza con tu API Key
  });

  // Polling para obtener la ubicación cada 5 segundos
  useEffect(() => {
    if (!pedidoId) return;
    const interval = setInterval(async () => {
      try {
        const ubicacion = await ApiService.get(`/ubicaciones/${pedidoId}`);
        if (ubicacion && ubicacion.lat && ubicacion.lng) {
          setPosicion({ lat: ubicacion.lat, lng: ubicacion.lng });
        }
      } catch (e) {
        setPosicion(null);
      }
    }, 5000);
    // Llama una vez al montar
    (async () => {
      try {
        const ubicacion = await ApiService.get(`/ubicaciones/${pedidoId}`);
        if (ubicacion && ubicacion.lat && ubicacion.lng) {
          setPosicion({ lat: ubicacion.lat, lng: ubicacion.lng });
        }
      } catch (e) {
        setPosicion(null);
      }
    })();
    return () => clearInterval(interval);
  }, [pedidoId]);

  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (!posicion) return <div>Esperando ubicación del chofer...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Seguimiento de mi Pedido</h2>
      <GoogleMap mapContainerStyle={containerStyle} center={posicion} zoom={15}>
        <Marker position={posicion} />
      </GoogleMap>
      <div className="mt-2">
        <b>Ubicación actual:</b> Lat: {posicion.lat}, Lng: {posicion.lng}
      </div>
    </div>
  );
};

export default SeguimientoPedido;
