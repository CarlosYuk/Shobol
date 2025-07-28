import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { USER_ROLES } from "../../types/index.js";
import {
  LayoutDashboard,
  Route,
  Truck,
  Users,
  Package,
  BarChart3,
  Settings,
  MapPin,
  FileText,
  Mountain,
  ClipboardList,
  Box,
  Plus,
} from "lucide-react";
//import MyRequests from "../../components/Cliente/MyRequests";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const baseItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const getNavigationItems = () => {
    switch (user?.rol) {
      case USER_ROLES.ADMIN:
        return [
          ...baseItems,
          { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
          { name: "Solicitudes", href: "/dashboard/requests", icon: FileText },
          { name: "Pedidos", href: "/dashboard/pedidos", icon: ClipboardList },
          { name: "Rutas", href: "/routes", icon: Route },
          { name: "Vehículos", href: "/dashboard/vehiculos", icon: Truck },
          { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
        ];
      case USER_ROLES.GESTOR:
        return [
          ...baseItems,
          { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
          { name: "Solicitudes", href: "/dashboard/requests", icon: FileText },
          { name: "Pedidos", href: "/dashboard/pedidos", icon: ClipboardList },
          { name: "Rutas", href: "/routes", icon: Route },
          { name: "Vehículos", href: "/dashboard/vehiculos", icon: Truck },
        ];
      case USER_ROLES.CLIENT:
        return [
          ...baseItems,
          {
            name: "Mis Solicitudes",
            href: "/dashboard/my-requests",
            icon: FileText,
          },
          {
            name: "Nueva Solicitud",
            href: "/dashboard/nueva-solicitud",
            icon: Plus,
          },
          { name: "Seguimiento", href: "/tracking", icon: MapPin },
        ];
      case USER_ROLES.CHOFER:
        return [
          ...baseItems,
          {
            name: "Mis Asignaciones",
            href: "/dashboard/mis-asignaciones",
            icon: ClipboardList,
          },
          {
            name: "Mi Ubicación",
            href: "/dashboard/mi-ubicacion",
            icon: MapPin,
          },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="bg-gradient-to-b from-emerald-900 to-lime-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-emerald-600 to-lime-600 p-2 rounded-xl">
            <Mountain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">SHOBOL</h2>
            <p className="text-emerald-200 text-sm">
              Transporte de Piedra Caliza
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-emerald-800 text-lime-300"
                      : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
const VehiculosTable = () => <div>Gestión de Vehículos</div>;

// En tu archivo de rutas
//<Route path="/my-requests" element={<MyRequests />} />;
