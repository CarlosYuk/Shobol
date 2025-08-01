import React, { useState, useEffect } from 'react';
import { Route, Truck, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import StatCard from './StatCard.jsx';

const GestorDashboard = () => {
  const [stats, setStats] = useState({
    rutas: 0,
    vehiculos: 0,
    pedidos: 0,
    mantenimiento: 0,
  });
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [rutas, vehiculos, pedidos, mensajes] = await Promise.all([
        fetch("http://localhost:5000/api/rutas").then(res => res.json()),
        fetch("http://localhost:5000/api/vehiculos").then(res => res.json()),
        fetch("http://localhost:5000/api/pedidos").then(res => res.json()),
        fetch("http://localhost:5000/api/mensajes").then(res => res.json()),
      ]);
      setStats({
        rutas: rutas.length,
        vehiculos: vehiculos.filter(v => v.estado === 'disponible').length,
        pedidos: pedidos.length,
        mantenimiento: vehiculos.filter(v => v.estado === 'mantenimiento').length,
      });
      setMensajes(mensajes);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  const statCards = [
    { title: 'Rutas Activas', value: stats.rutas, icon: Route, color: 'emerald' },
    { title: 'Vehículos Disponibles', value: stats.vehiculos, icon: Truck, color: 'lime' },
    { title: 'Pedidos Totales', value: stats.pedidos, icon: Package, color: 'amber' },
    { title: 'En Mantenimiento', value: stats.mantenimiento, icon: AlertTriangle, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard de Gestión</h1>
        <p className="text-stone-600">Control y monitoreo de rutas, vehículos y pedidos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Notificaciones */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Notificaciones</h3>
        <div className="space-y-4">
          {mensajes.filter(m => !m.leido).map(m => (
            <div key={m.id} className="bg-amber-100 p-4 rounded-lg">
              <p className="text-sm text-amber-900">{m.texto || m.mensaje}</p>
              <span className="text-xs text-stone-400">
                {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
          {mensajes.filter(m => !m.leido).length === 0 && (
            <div className="text-stone-500">Sin notificaciones nuevas.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestorDashboard;