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
import SolicitudForm from "../Cliente/SolicitudForm";
import { useAuth } from "../../context/AuthContext";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);

  const cargarSolicitudes = async () => {
    try {
      const todas = await ApiService.getRequests();
      // Filtra solo las del cliente actual
      setSolicitudes(todas.filter((s) => s.cliente_id === user.id));
    } catch (error) {
      setSolicitudes([]);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const stats = [
    { title: "Envíos Activos", value: 8, icon: Package, color: "emerald" },
    { title: "En Tránsito", value: 5, icon: Clock, color: "amber" },
    { title: "Entregados", value: 142, icon: CheckCircle, color: "lime" },
    { title: "Pendientes", value: 3, icon: AlertCircle, color: "red" },
  ];

  const recentShipments = [
    {
      id: "ENV-2024-001",
      cargo: "Piedra Caliza Triturada",
      route: "Lima - Arequipa",
      status: "in-transit",
      progress: 65,
      estimatedArrival: "2024-01-20 14:30",
    },
    {
      id: "ENV-2024-002",
      cargo: "Caliza Industrial",
      route: "Cusco - Puerto Maldonado",
      status: "pending",
      progress: 0,
      estimatedArrival: "2024-01-22 09:00",
    },
    {
      id: "ENV-2024-003",
      cargo: "Piedra Caliza Pulverizada",
      route: "Trujillo - Chiclayo",
      status: "delivered",
      progress: 100,
      estimatedArrival: "2024-01-18 16:45",
    },
  ];

  const upcomingServices = [
    {
      date: "2024-01-22",
      service: "Transporte de Caliza",
      route: "Lima - Arequipa",
    },
    {
      date: "2024-01-25",
      service: "Transporte Industrial",
      route: "Cusco - Lima",
    },
    {
      date: "2024-01-28",
      service: "Transporte Especial",
      route: "Iquitos - Lima",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Entregado";
      case "in-transit":
        return "En Tránsito";
      case "pending":
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
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-900">
                    {shipment.id}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      shipment.status
                    )}`}
                  >
                    {getStatusText(shipment.status)}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-stone-700">
                    {shipment.cargo}
                  </p>
                  <p className="text-sm text-stone-500">{shipment.route}</p>
                </div>
                {shipment.status === "in-transit" && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                      <span>Progreso</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center text-xs text-stone-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Llegada estimada: {shipment.estimatedArrival}
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
            {upcomingServices.map((service, index) => (
              <div
                key={index}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-900">
                    {service.service}
                  </span>
                  <span className="text-sm text-emerald-600 font-medium">
                    {service.date}
                  </span>
                </div>
                <div className="flex items-center text-sm text-stone-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {service.route}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            {/* Aquí agregas el formulario */}
            <SolicitudForm
              clienteId={user.id}
              onSolicitudCreada={cargarSolicitudes}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
            <Package className="h-6 w-6 text-emerald-600" />
            <div className="text-left">
              <div className="font-medium text-stone-900">Nuevo Envío</div>
              <div className="text-sm text-stone-500">Solicitar transporte</div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
            <MapPin className="h-6 w-6 text-lime-600" />
            <div className="text-left">
              <div className="font-medium text-stone-900">Rastrear Envío</div>
              <div className="text-sm text-stone-500">
                Seguimiento en tiempo real
              </div>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
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
