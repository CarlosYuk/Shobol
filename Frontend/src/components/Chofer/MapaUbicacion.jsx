import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { enviarUbicacion } from "../../services/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapaUbicacion = () => {
  const [posicion, setPosicion] = useState(null);
  const [pedidoId, setPedidoId] = useState(null);
  const [error, setError] = useState("");
  const [loadingPedido, setLoadingPedido] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClTNi7CRWB1KBn-YJXDjUFjAOYq6evRDY",
  });

  // 1. Obtener el pedido activo del chofer al montar el componente
  useEffect(() => {
    setLoadingPedido(true);
    fetch("http://localhost:5000/api/pedidos/activo-chofer", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setPedidoId(data.id);
        } else {
          setError("No tienes un pedido activo asignado.");
        }
      })
      .catch(() => setError("Error al obtener pedido activo."))
      .finally(() => setLoadingPedido(false));
  }, []);

  // 2. Enviar ubicación solo si hay pedidoId
  useEffect(() => {
    let watchId;
    if (navigator.geolocation && pedidoId) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosicion(coords);
          // Log para depuración
          console.log("Enviando ubicación:", { pedido_id: pedidoId, ...coords });
          enviarUbicacion({
            pedido_id: pedidoId,
            ...coords,
          });
        },
        (err) => {
          setError("No se pudo obtener la ubicación.");
        }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [pedidoId]);

  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (loadingPedido) return <div>Buscando pedido activo...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!posicion) return <div>Obteniendo ubicación actual...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={posicion} zoom={15}>
      <Marker position={posicion} />
    </GoogleMap>
  );
};

export default MapaUbicacion;
