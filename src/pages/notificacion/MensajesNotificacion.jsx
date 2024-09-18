import React, { useState } from 'react';

const MensajesNotificacion = ({ notifications }) => {
    const [showMessages, setShowMessages] = useState(false);

    const toggleMessages = () => {
        setShowMessages(!showMessages);
    };

    return (
        <div>
            <button onClick={toggleMessages}>
                Ver notificaciones
            </button>
            {showMessages && (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id}>
                            <strong>{notification.tipo_mensaje}</strong>: {notification.mensaje} ({new Date(notification.fecha).toLocaleString()})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MensajesNotificacion;