import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./components/Landing/LandingPage";
import DashboardLayout from "./components/Layout/DashboardLayout";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import GestorDashboard from "./components/Dashboard/GestorDashboard";
import ClientDashboard from "./components/Dashboard/ClientDashboard";
import UsersTable from "./components/Admin/UsersTable";
import RequestsTable from "./components/Admin/RequestsTable";
import PedidosTable from "./components/Admin/PedidosTable";
import VehiculosTable from "./components/Admin/VehiculosTable";
import ProtectedRoute from "./components/ProtectedRoute";
import SolicitudForm from "./components/Cliente/SolicitudForm";
// Define los roles válidos para el sistema

const ROLES_VALIDOS = ["administrador", "gestor", "cliente"];

const AppRoutes = () => {
  const { user, loading } = useAuth(); // Asegúrate que tu AuthContext exponga loading

  // Si aún está cargando el usuario, muestra un loader o nada
  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario y no está cargando, muestra las rutas públicas
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  // Si el usuario existe y tiene un rol válido, muestra el dashboard
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            user.rol === "administrador" ? (
              <AdminDashboard />
            ) : user.rol === "gestor" ? (
              <GestorDashboard />
            ) : (
              <ClientDashboard />
            )
          }
        />
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="usuarios" element={<UsersTable />} />
        )}
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="requests" element={<RequestsTable />} />
        )}
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="pedidos" element={<PedidosTable />} />
        )}
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="vehiculos" element={<VehiculosTable />} />
        )}
        {user.rol === "cliente" && (
          <Route
            path="/dashboard/nueva-solicitud"
            element={<SolicitudForm clienteId={user.id} />}
          />
        )}
        {/* ...otras rutas... */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
