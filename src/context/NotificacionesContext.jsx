import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from "./AuthContext";

const NotificacionesContext = createContext();

export const useNotificaciones = () => useContext(NotificacionesContext);

export const NotificacionesProvider = ({ children }) => {
  const [cantidadNotificacionesNoLeidas, setCantidadNotificacionesNoLeidas] = useState(0);
  const { authTokens } = useAuth();

  // Hacer el fetch para obtener los mensajes no leídos
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
  }, [authTokens]); // Se ejecutará nuevamente si authTokens cambia

  // Función para actualizar la cantidad de mensajes no leídos cuando se marca un mensaje como leído
  const marcarMensajeComoLeido = () => {
    setCantidadMensajesNoLeidos(prev => Math.max(0, prev - 1)); // Decrementar la cantidad de mensajes no leídos
  };

  return (
    <MensajesContext.Provider value={{ cantidadMensajesNoLeidos, marcarMensajeComoLeido }}>
      {children}
    </MensajesContext.Provider>
  );
};