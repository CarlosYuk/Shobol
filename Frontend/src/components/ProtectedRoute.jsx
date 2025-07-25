import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requiredRole && user.rol !== requiredRole) return <Navigate to="/" replace />;
  if (requiredRoles && !requiredRoles.includes(user.rol)) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;