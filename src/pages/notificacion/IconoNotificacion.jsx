import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './IconoNotificacion.css';  // Puedes agregar estilos personalizados aquí

const IconoNotificacion = () => {
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/api/mensajes/');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error en acceder a las notificaciones', error);
            }
        };

        fetchNotifications();
    }, []);
    
    const unreadCount = notifications.length;

    return (
        <div className="notification-icon">
            <img src="/path/to/your/mail-icon.png" alt="Correo" className="mail-icon"/>
            {unreadCount > 0 && (
                <div className="notification-count">
                    {unreadCount}
                </div>
            )}
        </div>
    );
};

export default IconoNotificacion;
