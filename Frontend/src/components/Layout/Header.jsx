import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-stone-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-lime-700 bg-clip-text text-transparent">SHOBOL S.A.</h1>
          <span className="text-sm text-stone-500 hidden md:block">
            Sistema de Gestión de Transporte de Piedra Caliza
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-stone-400 hover:text-stone-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-stone-900">{user?.nombre}</p>
              <p className="text-xs text-stone-500 capitalize">
                {user?.rol ? user.rol.replace('-', ' ') : ""}
              </p>
            </div>
            <div className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-lime-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-2 text-center">
        <span>
          {user?.nombre
            ? user.nombre.replace(/\b\w/g, (l) => l.toUpperCase())
            : "Usuario"}
        </span>
      </div>
    </header>
  );
};

export default Header;