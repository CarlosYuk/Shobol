import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ChoferAsignaciones = () => {
  const { user } = useAuth();
  const [choferId, setChoferId] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar el chofer_id usando el usuario_id
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:5000/api/choferes/usuario/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) setChoferId(data.id);
      });
  }, [user]);

  // Buscar los pedidos asignados a ese chofer
  useEffect(() => {
    if (!choferId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/pedidos/chofer/${choferId}`)
      .then((res) => res.json())
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [choferId]);

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

  if (loading) return <div>Cargando asignaciones...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis Asignaciones</h2>
      {pedidos.length === 0 ? (
        <p>No tienes asignaciones actualmente.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
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
                <strong>Lugar de entrega:</strong> {pedido.solicitud?.lugar_entrega}
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
              {/* Elimina o reemplaza el campo modelo */}
              {pedido.estado !== "entregado" && (
                <button
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded"
                  onClick={() => marcarEntregado(pedido.id)}
                >
                  Marcar como entregado
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChoferAsignaciones;
