import React, { useState, useEffect } from 'react';
import { Route, Truck, Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import StatCard from './StatCard.jsx';
import apiService from '../../services/api.js';

const GestorDashboard = () => {
  const [data, setData] = useState({
    assignments: [],
    routes: [],
    vehicles: [],
    loads: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [assignments, routes, vehicles, loads] = await Promise.all([
        apiService.getAssignments(),
        apiService.getRoutes(),
        apiService.getVehicles(),
        apiService.getLoads()
      ]);

      setData({ assignments, routes, vehicles, loads });
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={loadDashboardData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const stats = [
    { 
      title: 'Rutas Activas', 
      value: data.routes?.filter(r => r.estado === 'activa')?.length || 0, 
      icon: Route, 
      color: 'emerald' 
    },
    { 
      title: 'Vehículos Disponibles', 
      value: data.vehicles?.filter(v => v.estado === 'disponible')?.length || 0, 
      icon: Truck, 
      color: 'lime' 
    },
    { 
      title: 'Asignaciones Hoy', 
      value: data.assignments?.filter(a => {
        const today = new Date().toDateString();
        return new Date(a.fecha_asignacion).toDateString() === today;
      })?.length || 0, 
      icon: Package, 
      color: 'amber' 
    },
    { 
      title: 'En Mantenimiento', 
      value: data.vehicles?.filter(v => v.estado === 'mantenimiento')?.length || 0, 
      icon: AlertTriangle, 
      color: 'red' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard de Gestión</h1>
        <p className="text-stone-600">Control y monitoreo de rutas, vehículos y asignaciones</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">Asignaciones Recientes</h3>
            <Package className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-4">
            {data.assignments?.slice(0, 5).map((assignment) => (
              <div key={assignment.id} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-900">
                    Asignación #{assignment.id}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignment.estado === 'completada' ? 'bg-emerald-100 text-emerald-800' :
                    assignment.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {assignment.estado}
                  </span>
                </div>
                <div className="text-sm text-stone-600">
                  <p>Pedido: {assignment.pedido_id}</p>
                  <p>Ruta: {assignment.ruta_id}</p>
                  <p>Vehículo: {assignment.vehiculo_id}</p>
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
            {data.vehicles?.slice(0, 5).map((vehicle) => (
              <div key={vehicle.id} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-stone-900">{vehicle.placa}</span>
                    <span className="text-sm text-stone-500">{vehicle.tipo}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.estado === 'disponible' ? 'bg-emerald-100 text-emerald-800' :
                    vehicle.estado === 'en_ruta' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {vehicle.estado}
                  </span>
                </div>
                <p className="text-sm text-stone-600">{vehicle.ubicacion_actual || 'Base principal'}</p>
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
              <div className="font-medium text-blue-900">
                {data.assignments?.filter(a => a.estado === 'pendiente').length || 0} Pendientes
              </div>
              <div className="text-sm text-blue-600">Por asignar</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
            <Package className="h-8 w-8 text-amber-600" />
            <div>
              <div className="font-medium text-amber-900">
                {data.assignments?.filter(a => a.estado === 'en_progreso').length || 0} En Ruta
              </div>
              <div className="text-sm text-amber-600">En progreso</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div>
              <div className="font-medium text-emerald-900">
                {data.assignments?.filter(a => a.estado === 'completada').length || 0} Completadas
              </div>
              <div className="text-sm text-emerald-600">Finalizadas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestorDashboard;