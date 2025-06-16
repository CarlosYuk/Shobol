import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UsersTable from "../Admin/UsersTable";
import GestorDashboard from "./GestorDashboard";
import ClienteDashboard from "./ClientDashboard"; // Asegúrate que el nombre y archivo coincidan

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <div>Cargando usuario...</div>;

  if (user.rol === "administrador") {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="usuarios" element={<UsersTable />} />
        {/* Agrega más rutas según tus apartados */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  if (user.rol === "gestor") {
    return <GestorDashboard />;
  }

  if (user.rol === "cliente") {
    return <ClienteDashboard />;
  }

  return <div>No tienes acceso a ningún panel.</div>;
};

export default DashboardRouter;
