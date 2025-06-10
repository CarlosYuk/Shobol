import React from 'react';
import StatCard from './StatCard';
import { Users, Truck, Route, Package, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Usuarios', value: 245, icon: Users, color: 'emerald', trend: { value: 12, isPositive: true } },
    { title: 'Vehículos Activos', value: 38, icon: Truck, color: 'lime', trend: { value: 5, isPositive: true } },
    { title: 'Rutas Operativas', value: 15, icon: Route, color: 'teal', trend: { value: 0, isPositive: true } },
    { title: 'Envíos del Mes', value: 1247, icon: Package, color: 'amber', trend: { value: 18, isPositive: true } }
  ];

  const recentActivities = [
    { id: 1, action: 'Nueva ruta creada', details: 'Ruta Lima - Arequipa', time: '2 min ago', type: 'success' },
    { id: 2, action: 'Vehículo en mantenimiento', details: 'TRK-001 fuera de servicio', time: '15 min ago', type: 'warning' },
    { id: 3, action: 'Usuario registrado', details: 'Cliente: Cementos del Norte S.A.', time: '1 hora ago', type: 'info' },
    { id: 4, action: 'Envío completado', details: 'ENV-2024-001 entregado', time: '2 horas ago', type: 'success' }
  ];

  const pendingTasks = [
    { id: 1, task: 'Revisar solicitud de nueva ruta', priority: 'high' },
    { id: 2, task: 'Aprobar mantenimiento de vehículo TRK-005', priority: 'medium' },
    { id: 3, task: 'Actualizar tarifas de transporte', priority: 'low' },
    { id: 4, task: 'Revisar reportes mensuales', priority: 'medium' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard Administrativo</h1>
        <p className="text-stone-600">Resumen general del sistema de transporte</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">Actividad Reciente</h3>
            <TrendingUp className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-amber-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900">{activity.action}</p>
                  <p className="text-sm text-stone-500">{activity.details}</p>
                </div>
                <span className="text-xs text-stone-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-900">Tareas Pendientes</h3>
            <AlertCircle className="h-5 w-5 text-stone-400" />
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm text-stone-900">{task.task}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Resumen de Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">98.5%</div>
            <div className="text-sm text-stone-600">Entregas a Tiempo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-lime-600">87%</div>
            <div className="text-sm text-stone-600">Utilización de Flota</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">4.8/5</div>
            <div className="text-sm text-stone-600">Satisfacción Cliente</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;