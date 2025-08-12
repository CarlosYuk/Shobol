import React, { createContext, useContext, useEffect, useState } from "react";

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
   /*  const fetchMensajes = async () => {
      const res = await fetch("http://localhost:5000/api/mensajes");
      const data = await res.json();
      setMensajes(data);
    };
    fetchMensajes();
    const interval = setInterval(fetchMensajes, 10000);
    return () => clearInterval(interval); */
  }, []);

  return (
    <NotificacionesContext.Provider value={{ mensajes, setMensajes }}>
      {children}
    </NotificacionesContext.Provider>
  );
};