import React from "react";
import { useAuth } from "../../context/AuthContext";

const DashboardRouter = () => {
  const { user } = useAuth();
  console.log("Usuario en DashboardRouter:", user);

  if (!user) return <div>Cargando usuario...</div>;

  switch (user?.rol) {
    case "administrador":
      return <div>Panel Administrador</div>;
    case "gestor":
      return <div>Panel Gestor</div>;
    case "cliente":
      return <div>Panel Cliente</div>;
    default:
      return <div>No tienes acceso a ningún panel.</div>;
  }
};

export default DashboardRouter;
