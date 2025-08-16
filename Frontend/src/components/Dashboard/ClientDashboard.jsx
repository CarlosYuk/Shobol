import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import ApiService from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  // Cargar solicitudes y pedidos reales
  const cargarSolicitudes = async () => {
    try {
      const todas = await ApiService.getRequests();
      setSolicitudes(todas.filter((s) => s.cliente_id === user.id));
    } catch (error) {
      setSolicitudes([]);
    }
  };

  const cargarPedidos = async () => {
    try {
      const todos = await ApiService.getPedidos();
      setPedidos(todos.filter((p) => p.cliente_id === user.id));
    } catch (error) {
      setPedidos([]);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
    cargarPedidos();
  }, []);

  // Estadísticas reales
  const stats = [
    {
      title: "Envíos Activos",
      value: pedidos.filter((p) => p.estado === "asignado" || p.estado === "en_transito").length,
      icon: Package,
      color: "emerald",
    },
    {
      title: "En Tránsito",
      value: pedidos.filter((p) => p.estado === "en_transito").length,
      icon: Clock,
      color: "amber",
    },
    {
      title: "Entregados",
      value: pedidos.filter((p) => p.estado === "entregado").length,
      icon: CheckCircle,
      color: "lime",
    },
    {
      title: "Pendientes",
      value: solicitudes.filter((s) => s.estado === "pendiente").length,
      icon: AlertCircle,
      color: "red",
    },
  ];

  // Envíos recientes (últimos 3 pedidos)
  const recentShipments = pedidos
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 3);

  // Servicios próximos (puedes adaptar según tu modelo)
  const upcomingServices = solicitudes
    .filter((s) => s.estado === "aprobada")
    .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega))
    .slice(0, 3);

  const getStatusColor = (status) => {
    switch (status) {
      case "entregado":
        return "bg-emerald-100 text-emerald-800";
      case "en_transito":
        return "bg-blue-100 text-blue-800";
      case "asignado":
        return "bg-amber-100 text-amber-800";
      case "pendiente":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "entregado":
        return "Entregado";
      case "en_transito":
        return "En Tránsito";
      case "asignado":
        return "Asignado";
      case "pendiente":
        return "Pendiente";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Mi Dashboard</h1>
        <p className="text-stone-600">Seguimiento de sus envíos y servicios</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Shipments and Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">
              Envíos Recientes
            </h3>
            <Package className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-4">
            {recentShipments.length === 0 && (
              <div className="text-stone-500">No hay envíos recientes.</div>
            )}
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-900">
                    {shipment.numero_envio || shipment.id}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      shipment.estado
                    )}`}
                  >
                    {getStatusText(shipment.estado)}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-stone-700">
                    {shipment.descripcion || "Sin descripción"}
                  </p>
                  <p className="text-sm text-stone-500">
                    {shipment.direccion_entrega}
                  </p>
                </div>
                {/* Solo mostrar seguimiento si NO está entregado */}
                {shipment.estado !== "entregado" && (
                  <Link
                    to={`/dashboard/seguimiento/${shipment.id}`}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Ver seguimiento
                  </Link>
                )}
                <div className="flex items-center text-xs text-stone-500 mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {shipment.fecha_entrega
                    ? `Entrega estimada: ${shipment.fecha_entrega}`
                    : `Creado: ${shipment.fecha_creacion}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Services */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">
              Próximos Servicios
            </h3>
            <Calendar className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-4">
            {upcomingServices.length === 0 && (
              <div className="text-stone-500">No hay servicios próximos.</div>
            )}
            {upcomingServices.map((service, index) => (
              <div
                key={service.id || index}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-900">
                    {service.nombreEmpresa || "Servicio"}
                  </span>
                  <span className="text-sm text-emerald-600 font-medium">
                    {service.fecha_entrega || "Próximamente"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-stone-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {service.lugar_entrega}
                </div>
              </div>
            ))}
          </div>
          {/* Eliminado el formulario de solicitud aquí */}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            onClick={() => navigate("/dashboard/nueva-solicitud")}
          >
            <Package className="h-6 w-6 text-emerald-600" />
            <div className="text-left">
              <div className="font-medium text-stone-900">Nuevo Envío</div>
              <div className="text-sm text-stone-500">Solicitar transporte</div>
            </div>
          </button>
          <button
            className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            onClick={() => navigate("/tracking")}
          >
            <MapPin className="h-6 w-6 text-lime-600" />
            <div className="text-left">
              <div className="font-medium text-stone-900">Rastrear Envío</div>
              <div className="text-sm text-stone-500">
                Seguimiento en tiempo real
              </div>
            </div>
          </button>
          <button
            className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            onClick={() => navigate("/soporte")}
          >
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <div className="text-left">
              <div className="font-medium text-stone-900">Soporte</div>
              <div className="text-sm text-stone-500">Contactar ayuda</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
