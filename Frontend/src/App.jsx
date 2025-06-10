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
import DashboardRouter from "./components/Dashboard/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";

const ROLES_VALIDOS = ["administrador", "gestor", "cliente"];

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user && ROLES_VALIDOS.includes(user.rol) ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardRouter />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
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
