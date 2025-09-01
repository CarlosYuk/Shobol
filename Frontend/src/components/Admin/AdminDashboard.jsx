import React from "react";
import DashboardEnviosCliente from "./DashboardEnviosCliente";

const AdminDashboard = () => {
  return (
    <div>
      {/* ...otros componentes y secciones del dashboard... */}
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Sección de envíos por cliente */}
      <DashboardEnviosCliente />
    </div>
  );
};

export default AdminDashboard;