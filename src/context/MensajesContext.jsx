// MensajesContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from "./AuthContext";

const MensajesContext = createContext();

export const useMensajes = () => useContext(MensajesContext);

export const MensajesProvider = ({ children }) => {
  const [cantidadMensajesNoLeidos, setCantidadMensajesNoLeidos] = useState(0);
  const [cantidadNotificacionesNoVistas, setCantidadNotificacionesNoVistas] = useState(0);
  const { authTokens, user } = useAuth();

  // Fetch para obtener mensajes no leídos
  useEffect(() => {
    const fetchMensajesNoLeidos = async () => {
      if (!authTokens?.refresh) {
        console.warn('Token de autorización no disponible');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/mensajes/no_leidos/', {
          headers: {
            'Authorization': `Bearer ${authTokens.refresh}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los mensajes no leídos');
        }

        const data = await response.json();
        setCantidadMensajesNoLeidos(data.cantidad_no_leidos || 0);
      } catch (error) {
        console.error('Error al hacer fetch de los mensajes:', error);
      }
    };

    fetchMensajesNoLeidos();
  }, [authTokens]);

  // Fetch para obtener notificaciones no vistas si el usuario es un alumno
  useEffect(() => {
    const fetchNotificacionesNoVistas = async () => {
      if (!authTokens?.refresh || user?.role !== "Alumno") {
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/notificaciones/', {
          headers: {
            Authorization: `Bearer ${authTokens.refresh}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener notificaciones');
        }

        const data = await response.json();
        const unreadCount = data.filter((notif) => !notif.visto).length;
        setCantidadNotificacionesNoVistas(unreadCount);
      } catch (error) {
        console.error('Error al hacer fetch de las notificaciones:', error);
      }
    };

    fetchNotificacionesNoVistas();
    const interval = setInterval(fetchNotificacionesNoVistas, 60000); // Polling cada minuto

    return () => clearInterval(interval);
  }, [authTokens, user]);

  // Función para marcar un mensaje como leído
  const marcarMensajeComoLeido = () => {
    setCantidadMensajesNoLeidos((prev) => Math.max(0, prev - 1));
  };

  // Función para marcar una notificación como vista
  const marcarNotificacionComoVista = () => {
    setCantidadNotificacionesNoVistas((prev) => Math.max(0, prev - 1));
  };

  return (
    <MensajesContext.Provider
      value={{
        cantidadMensajesNoLeidos,
        cantidadNotificacionesNoVistas,
        marcarMensajeComoLeido,
        marcarNotificacionComoVista,
      }}
    >
      {children}
    </MensajesContext.Provider>
  );
};