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
import MyRequests from "./components/Cliente/MyRequests";
import RecuperarContrasena from "./components/Landing/RecuperarContrasena";
import Reportes from "./pages/Reportes";
import ChoferAsignaciones from "./components/Chofer/ChoferAsignaciones";
import MapaUbicacion from "./components/Chofer/MapaUbicacion";
import DashboardChofer from "./components/Dashboard/DashboardChofer"; // Asegúrate de importar el nuevo componente
import SeguimientoPedido from "./components/Cliente/SeguimientoPedido";
import SeguimientoPedidoWrapper from "./components/Cliente/SeguimientoPedidoWrapper";

// Define los roles válidos para el sistema

const ROLES_VALIDOS = ["administrador", "gestor", "cliente", "chofer"]; // Agrega "chofer"

const AppRoutes = () => {
  const { user, loading } = useAuth(); // Asegúrate que tu AuthContext exponga loading

  // Si aún está cargando el usuario, muestra un loader o nada
  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario y no está cargando, muestra las rutas públicas
  if (!user) {
    return (
      <Routes>
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
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
            ) : user.rol === "chofer" ? (
              <ChoferAsignaciones />
            ) : (
              <ClientDashboard />
            )
          }
        />
        {/* Rutas para administrador y gestor */}
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="usuarios" element={<UsersTable />} />
        )}
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="requests" element={<RequestsTable />} />
        )}
        {(user.rol === "administrador" || user.rol === "gestor") && (
          <Route path="pedidos" element={<PedidosTable />} />
        )}
        <Route
          path="vehiculos"
          element={
            <ProtectedRoute roles={["administrador", "gestor"]}>
              <VehiculosTable />
            </ProtectedRoute>
          }
        />
        {/* Ruta para chofer: Mis Asignaciones */}
        {user.rol === "chofer" && (
          <Route
            path="/dashboard/mis-asignaciones"
            element={<ChoferAsignaciones />}
          />
        )}
        {user.rol === "cliente" && (
          <Route
            path="nueva-solicitud"
            element={<SolicitudForm clienteId={user.id} />}
          />
        )}
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="reports" element={<Reportes />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
      <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard/mi-ubicacion" element={<MapaUbicacion />} />
      <Route path="/dashboard" element={<DashboardChofer />} />{" "}
      {/* Nueva ruta para DashboardChofer */}
      <Route
        path="/dashboard/seguimiento/:pedidoId"
        element={<SeguimientoPedidoWrapper />}
      />
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
