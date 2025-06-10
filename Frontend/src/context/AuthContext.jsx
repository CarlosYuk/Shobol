import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user && !!token;

  const login = async ({ correo, contrasena }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiService.login({ correo, contrasena });
      if (res.token && res.usuario) {
        setUser(res.usuario);
        setToken(res.token);
        localStorage.setItem("user", JSON.stringify(res.usuario));
        localStorage.setItem("token", res.token);
        return true;
      }
      setError("Credenciales inválidas");
      return false;
    } catch (err) {
      setError("Credenciales inválidas");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.register(userData);
      return true;
    } catch (err) {
      setError("No se pudo registrar");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    // Si el token expira, puedes agregar lógica aquí
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);