// Tipos y constantes para el proyecto
export const USER_ROLES = {
  ADMIN: "administrador",
  GESTOR: "gestor",
  CLIENT: "cliente",
  CHOFER: "chofer",
};

export const API_BASE_URL = "http://localhost:5000/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/registro",
  },
  USERS: "/usuarios",
  ASSIGNMENTS: "/asignaciones",
  REQUESTS: "/solicitudes",
  LOADS: "/cargas",
  ROUTES: "/rutas",
  VEHICLES: "/vehiculos",
  REPORTS: "/reportes",
};
