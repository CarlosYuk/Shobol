import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MapaUbicacion from "./MapaUbicacion";

const ChoferAsignaciones = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [origen, setOrigen] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Buscar los pedidos asignados a este chofer (usuario)
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/pedidos/chofer/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [user]);

  // Acción para marcar como entregado
  const marcarEntregado = async (pedidoId) => {
    await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/entregar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId }),
    });
    // Actualiza la lista de pedidos
    setPedidos((pedidos) =>
      pedidos.map((p) =>
        p.id === pedidoId ? { ...p, estado: "entregado" } : p
      )
    );
  };

  const handleVerRuta = (pedido) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const ubicacionActual = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          // Guardar la ubicación en la tabla ubicaciones
          fetch("http://localhost:5000/api/ubicaciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pedido_id: pedido.id,
              lat: ubicacionActual.lat,
              lng: ubicacionActual.lng,
            }),
          });
          setOrigen(ubicacionActual);
          setPedidoSeleccionado(pedido);
        },
        () => {
          alert("No se pudo obtener la ubicación actual.");
        }
      );
    } else {
      alert("Geolocalización no soportada.");
    }
  };

  if (loading) return <div>Cargando asignaciones...</div>;

  // Separar pedidos asignados y entregados
  const pedidosAsignados = pedidos.filter(
    (p) => p.estado !== "entregado"
  );
  const pedidosEntregados = pedidos.filter(
    (p) => p.estado === "entregado"
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis Asignaciones</h2>

      {/* Pedidos Asignados */}
      <h3 className="text-lg font-semibold mb-2 text-emerald-700">Asignados</h3>
      {pedidosAsignados.length === 0 ? (
        <p>No tienes asignaciones pendientes actualmente.</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {pedidosAsignados.map((pedido) => (
            <li key={pedido.id} className="p-4 bg-white rounded shadow">
              <div>
                <strong>Pedido:</strong> {pedido.id}
              </div>
              <div>
                <strong>Cliente:</strong> {pedido.solicitud?.nombreCliente}
              </div>
              <div>
                <strong>Apellido:</strong> {pedido.solicitud?.apellido}
              </div>
              <div>
                <strong>Empresa:</strong> {pedido.solicitud?.nombreEmpresa}
              </div>
              <div>
                <strong>Lugar de entrega:</strong>{" "}
                {pedido.solicitud?.lugar_entrega}
              </div>
              <div>
                <strong>Estado:</strong> {pedido.estado}
              </div>
              <div>
                <strong>Material:</strong> {pedido.material}
              </div>
              <div>
                <strong>Cantidad (ton):</strong> {pedido.cantidad_toneladas}
              </div>
              <div>
                <strong>Dirección de entrega:</strong>{" "}
                {pedido.direccion_entrega}
              </div>
              <div>
                <strong>Fecha de entrega:</strong>{" "}
                {new Date(pedido.fecha_entrega).toLocaleString()}
              </div>
              <div>
                <strong>Vehículo:</strong> {pedido.vehiculo?.numero_vehiculo}
              </div>
              <div>
                <strong>Placa:</strong> {pedido.vehiculo?.placa}
              </div>
              <div>
                <strong>Propietario:</strong>{" "}
                {pedido.vehiculo?.nombre_propietario}
              </div>
              <button
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded"
                onClick={() => marcarEntregado(pedido.id)}
              >
                Marcar como entregado
              </button>
              <button
                className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => handleVerRuta(pedido)}
              >
                Ver ruta
              </button>
              {pedidoSeleccionado &&
                pedidoSeleccionado.id === pedido.id &&
                origen && (
                  <MapaUbicacion
                    origen={origen}
                    destino={{
                      lat: pedido.latitud_entrega,
                      lng: pedido.longitud_entrega,
                    }}
                  />
                )}
            </li>
          ))}
        </ul>
      )}

      {/* Pedidos Entregados */}
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Entregados</h3>
      {pedidosEntregados.length === 0 ? (
        <p>No tienes pedidos entregados.</p>
      ) : (
        <ul className="space-y-4">
          {pedidosEntregados.map((pedido) => (
            <li key={pedido.id} className="p-4 bg-gray-100 rounded shadow">
              <div>
                <strong>Pedido:</strong> {pedido.id}
              </div>
              <div>
                <strong>Cliente:</strong> {pedido.solicitud?.nombreCliente}
              </div>
              <div>
                <strong>Apellido:</strong> {pedido.solicitud?.apellido}
              </div>
              <div>
                <strong>Empresa:</strong> {pedido.solicitud?.nombreEmpresa}
              </div>
              <div>
                <strong>Lugar de entrega:</strong>{" "}
                {pedido.solicitud?.lugar_entrega}
              </div>
              <div>
                <strong>Estado:</strong> {pedido.estado}
              </div>
              <div>
                <strong>Material:</strong> {pedido.material}
              </div>
              <div>
                <strong>Cantidad (ton):</strong> {pedido.cantidad_toneladas}
              </div>
              <div>
                <strong>Dirección de entrega:</strong>{" "}
                {pedido.direccion_entrega}
              </div>
              <div>
                <strong>Fecha de entrega:</strong>{" "}
                {new Date(pedido.fecha_entrega).toLocaleString()}
              </div>
              <div>
                <strong>Vehículo:</strong> {pedido.vehiculo?.numero_vehiculo}
              </div>
              <div>
                <strong>Placa:</strong> {pedido.vehiculo?.placa}
              </div>
              <div>
                <strong>Propietario:</strong>{" "}
                {pedido.vehiculo?.nombre_propietario}
              </div>
              {/* No mostrar botones para entregados */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChoferAsignaciones;
