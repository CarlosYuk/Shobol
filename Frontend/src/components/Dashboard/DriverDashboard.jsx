import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import {
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import ApiService from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const DriverDashboard = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  // Cargar pedidos asignados al chofer
  const cargarPedidos = async () => {
    try {
      const todos = await ApiService.getPedidos();
      setPedidos(todos.filter((p) => p.chofer_id === user.id));
    } catch (error) {
      setPedidos([]);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Estadísticas
  const stats = [
    {
      title: "Asignados",
      value: pedidos.filter((p) => p.estado === "asignado").length,
      icon: Truck,
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
      value: pedidos.filter((p) => p.estado === "pendiente").length,
      icon: AlertCircle,
      color: "red",
    },
  ];

  // Pedidos recientes (últimos 5)
  const recentPedidos = pedidos
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);

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
        <h1 className="text-2xl font-bold text-stone-900">Dashboard Chofer</h1>
        <p className="text-stone-600">Tus pedidos y actividades recientes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-900">
            Pedidos Recientes
          </h3>
          <Truck className="h-5 w-5 text-stone-400" />
        </div>
        <div className="space-y-4">
          {recentPedidos.length === 0 && (
            <div className="text-stone-500">No tienes pedidos recientes.</div>
          )}
          {recentPedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="border border-stone-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-stone-900">
                  {pedido.numero_envio || pedido.id}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    pedido.estado
                  )}`}
                >
                  {getStatusText(pedido.estado)}
                </span>
              </div>
              <div className="mb-2">
                <p className="text-sm font-medium text-stone-700">
                  {pedido.descripcion || "Sin descripción"}
                </p>
                <p className="text-sm text-stone-500">
                  {pedido.direccion_entrega}
                </p>
              </div>
              <div className="flex items-center text-xs text-stone-500 mt-2">
                <Clock className="h-3 w-3 mr-1" />
                {pedido.fecha_entrega
                  ? `Entrega estimada: ${pedido.fecha_entrega}`
                  : `Creado: ${pedido.fecha_creacion}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            onClick={() => navigate("/dashboard/pedidos")}
          >
            <Truck className="h-6 w-6 text-emerald-600" />
            <div className="text-left">
              <div className="font-medium text-stone-900">Ver Todos los Pedidos</div>
              <div className="text-sm text-stone-500">Gestiona tus entregas</div>
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

export default DriverDashboard;