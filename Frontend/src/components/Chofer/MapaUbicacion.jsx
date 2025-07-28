import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapaUbicacion = () => {
  const [posicion, setPosicion] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClTNi7CRWB1KBn-YJXDjUFjAOYq6evRDY", // Reemplaza con tu API Key
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosicion({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          alert("No se pudo obtener la ubicación.");
        }
      );
    }
  }, []);

  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (!posicion) return <div>Obteniendo ubicación...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={posicion} zoom={15}>
      <Marker position={posicion} />
    </GoogleMap>
  );
};

export default MapaUbicacion;
