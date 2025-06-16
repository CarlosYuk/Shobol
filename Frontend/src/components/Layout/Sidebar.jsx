import React from "react";
import { NavLink } from "react-router-dom";
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

const Sidebar = () => {
  const { user } = useAuth();

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
          { name: "Asignaciones", href: "/assignments", icon: ClipboardList },
          { name: "Cargas", href: "/loads", icon: Box },
          { name: "Rutas", href: "/routes", icon: Route },
          { name: "Vehículos", href: "/vehicles", icon: Truck },
          { name: "Reportes", href: "/reports", icon: BarChart3 },
          { name: "Configuración", href: "/settings", icon: Settings },
        ];
      case USER_ROLES.GESTOR:
        return [
          ...baseItems,
          { name: "Usuarios", href: "/dashboard/usuarios", icon: Users },
          { name: "Solicitudes", href: "/dashboard/requests", icon: FileText },
          { name: "Pedidos", href: "/dashboard/pedidos", icon: ClipboardList },
          { name: "Asignaciones", href: "/assignments", icon: ClipboardList },
          { name: "Cargas", href: "/loads", icon: Box },
          { name: "Rutas", href: "/routes", icon: Route },
          { name: "Vehículos", href: "/vehicles", icon: Truck },
          { name: "Seguimiento", href: "/tracking", icon: MapPin },
          { name: "Reportes", href: "/reports", icon: BarChart3 },
        ];
      case USER_ROLES.CLIENT:
        return [
          ...baseItems,
          { name: "Mis Solicitudes", href: "/my-requests", icon: FileText },
          {
            name: "Nueva Solicitud",
            href: "/dashboard/nueva-solicitud",
            icon: Plus,
          },
          { name: "Mis Envíos", href: "/my-shipments", icon: Package },
          { name: "Seguimiento", href: "/tracking", icon: MapPin },
          { name: "Historial", href: "/history", icon: BarChart3 },
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
