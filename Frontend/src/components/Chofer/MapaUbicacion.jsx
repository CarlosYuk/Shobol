import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapaUbicacion = ({ origen, destino, pedidoId }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClTNi7CRWB1KBn-YJXDjUFjAOYq6evRDY", // Tu API Key
  });
  const [directions, setDirections] = useState(null);

  // Enviar ubicación periódicamente al backend
  useEffect(() => {
    if (!pedidoId) return;
    let intervalId;
    function enviarUbicacion() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          fetch("http://localhost:5000/api/ubicaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pedido_id: pedidoId,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          });
        });
      }
    }
    // Enviar cada 10 segundos
    intervalId = setInterval(enviarUbicacion, 10000);
    // Enviar una vez al abrir
    enviarUbicacion();
    return () => clearInterval(intervalId);
  }, [pedidoId]);

  useEffect(() => {
    console.log("isLoaded:", isLoaded);
    console.log("Origen:", origen);
    console.log("Destino:", destino);

    if (isLoaded && origen && destino) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origen,
          destination: destino,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          console.log("Directions status:", status);
          if (status === "OK") {
            setDirections(result);
            console.log("Directions result:", result);
          } else {
            setDirections(null);
            console.error("Directions request failed:", status, result);
          }
        }
      );
    }
  }, [isLoaded, origen, destino]);

  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (!origen || !destino) return <div>Esperando datos de ubicación...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={origen} zoom={12}>
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapaUbicacion;
