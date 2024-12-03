import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useMensajes } from "../../context/MensajesContext"
import { Pagination } from 'react-bootstrap';
import './BaseNotificacion.css'; // Archivo CSS separado para estilos

const BaseNotificacion = () => {
    const { authTokens } = useAuth();
    const {marcarNotificacionComoVista, } = useMensajes();
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const notificationsPerPage = 8; // Número de notificaciones por página

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/notificaciones/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.refresh}`,
                },
            });
            const data = await response.json();
            setNotifications(data);
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Polling cada 1 min
        return () => clearInterval(interval);
    }, [authTokens]);

    const marcarComoLeido = async (id) => {
        await fetch(`http://127.0.0.1:8000/api/v1/estudiantes/notificaciones/${id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authTokens.refresh}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ visto: true }),
        });
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, visto: true } : notif))
        );

        marcarNotificacionComoVista();
        console.log(notifications.filter((notif) => !notif.visto).length)
    };

    const handleNotificationClick = (notif) => {
        if (!notif.visto){
            marcarComoLeido(notif.id);
        }
        setSelectedNotification(notif);
    };

    const handleBackClick = () => {
        setSelectedNotification(null);
    };

    // Lógica para calcular las notificaciones que se deben mostrar en la página actual
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Determinar el número total de páginas
    const totalPages = Math.ceil(notifications.length / notificationsPerPage);

    return (
        <div className="notifications-container">
            {selectedNotification ? (
                <div className="notification-detail">
                    <button onClick={handleBackClick} className="back-button">← Volver a Bandeja de Entrada</button>
                    <h3>{selectedNotification.tipo_evento}</h3>
                    <p>{selectedNotification.mensaje}</p>
                    <span>Recibido: {new Date(selectedNotification.fecha).toLocaleDateString()}, {new Date(selectedNotification.fecha).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            ) : (
                <div className="notification-list">
                    {currentNotifications.length === 0 ? (
                        <p>No tienes notificaciones</p>
                    ) : (
                        currentNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`notification-item ${notif.visto ? 'read' : 'unread'}`}
                            >
                                <h3 className="notification-title">{notif.tipo_evento}</h3>
                                <p className="notification-message">
                                    {notif.mensaje.length > 100
                                        ? `${notif.mensaje.substring(0, 100)}...`
                                        : notif.mensaje}
                                </p>
                                <span className="notification-date">
                                    {new Date(notif.fecha).toLocaleDateString()}, {new Date(notif.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))
                    )}

                    {/* Componente de paginación de React-Bootstrap */}
                    <Pagination className="pagination-container">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default BaseNotificacion;