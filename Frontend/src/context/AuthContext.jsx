import React, { createContext, useContext, useState } from "react";
import ApiService from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user && !!token;

  const login = async ({ correo, contrasena }) => {
    setLoading(true);
    try {
      const res = await ApiService.login({ correo, contrasena });
      if (res.token && res.usuario) {
        setUser(res.usuario);
        setToken(res.token);
        localStorage.setItem("user", JSON.stringify(res.usuario));
        localStorage.setItem("token", res.token);
        return true;
      }
      return "Correo o contraseña incorrecta";
    } catch (err) {
      return "Correo o contraseña incorrecta";
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await ApiService.register(userData);
      return true;
    } catch (err) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);