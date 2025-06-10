import React from 'react';
import StatCard from './StatCard';
import { Route, Truck, Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const RouteManagerDashboard = () => {
  const stats = [
    { title: 'Rutas Activas', value: 15, icon: Route, color: 'emerald' },
    { title: 'Vehículos Disponibles', value: 28, icon: Truck, color: 'lime' },
    { title: 'Envíos Hoy', value: 45, icon: Package, color: 'amber' },
    { title: 'En Mantenimiento', value: 3, icon: AlertTriangle, color: 'red' }
  ];

  const activeRoutes = [
    { id: 'R001', name: 'Lima - Arequipa', status: 'active', vehicles: 5, distance: '1015 km' },
    { id: 'R002', name: 'Cusco - Puerto Maldonado', status: 'active', vehicles: 3, distance: '532 km' },
    { id: 'R003', name: 'Trujillo - Chiclayo', status: 'maintenance', vehicles: 2, distance: '214 km' },
    { id: 'R004', name: 'Iquitos - Yurimaguas', status: 'active', vehicles: 4, distance: '389 km' }
  ];

  const vehicleStatus = [
    { plate: 'ABC-123', type: 'Tráiler', status: 'in-transit', location: 'Km 450 - Panamericana Sur' },
    { plate: 'DEF-456', type: 'Camión', status: 'available', location: 'Base Lima' },
    { plate: 'GHI-789', type: 'Tráiler', status: 'maintenance', location: 'Taller Central' },
    { plate: 'JKL-012', type: 'Camión', status: 'in-transit', location: 'Km 120 - Carretera Central' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'available':
        return 'bg-emerald-100 text-emerald-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'available':
        return 'Disponible';
      case 'in-transit':
        return 'En Tránsito';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Gestión de Rutas</h1>
        <p className="text-stone-600">Control y monitoreo de rutas y vehículos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Routes and Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Routes */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">Rutas Operativas</h3>
            <Route className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-4">
            {activeRoutes.map((route) => (
              <div key={route.id} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-stone-900">{route.name}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(route.status)}`}>
                      {getStatusText(route.status)}
                    </span>
                  </div>
                  <span className="text-sm text-stone-500">{route.id}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>{route.vehicles} vehículos</span>
                  <span>{route.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">Estado de Vehículos</h3>
            <Truck className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-4">
            {vehicleStatus.map((vehicle, index) => (
              <div key={index} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-stone-900">{vehicle.plate}</span>
                    <span className="text-sm text-stone-500">{vehicle.type}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                    {getStatusText(vehicle.status)}
                  </span>
                </div>
                <p className="text-sm text-stone-600">{vehicle.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Programación de Hoy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">12 Salidas</div>
              <div className="text-sm text-blue-600">Programadas</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
            <Package className="h-8 w-8 text-amber-600" />
            <div>
              <div className="font-medium text-amber-900">8 En Ruta</div>
              <div className="text-sm text-amber-600">En Tránsito</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div>
              <div className="font-medium text-emerald-900">15 Completadas</div>
              <div className="text-sm text-emerald-600">Entregadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteManagerDashboard;