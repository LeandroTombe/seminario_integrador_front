import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BaseNotificacion = () => {
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);

  // Obtiene las notificaciones actuales desde la API
  useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/v1/estudiantes/mensajes/');
            console.log(response.data);  // Para verificar la estructura de los datos
            if (Array.isArray(response.data)) {
                setNotifications(response.data);
            } else {
                console.error('La respuesta no es un array:', response.data);
            }
        } catch (error) {
            console.error('Error al obtener las notificaciones:', error);
        }
    };

    fetchNotifications();
  }, []);

  // Conectar a WebSocket para recibir nuevas notificaciones en tiempo real
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/notificaciones/');

    socket.onopen = () => {
        console.log('WebSocket conectado');
    };

    socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        setNotifications(prev => [newNotification, ...prev]);
    };

    socket.onerror = (error) => {
        console.error('Error en el WebSocket:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket cerrado');
    };

    setWs(socket);

    return () => {
        socket.close();
    };
  }, []);

  return (
    <div className="notifications-container">
      <h3>Notificaciones</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index} className={`notification ${notification.tipo}`}>
              <span>{notification.contenido}</span>
              <span className="notification-date">{new Date(notification.fecha).toLocaleString()}</span>
            </li>
          ))
        ) : (
          <p>No tienes notificaciones nuevas</p>
        )}
      </ul>
    </div>
  );
};

export default BaseNotificacion;
