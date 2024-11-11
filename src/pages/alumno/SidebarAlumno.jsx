import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './SidebarAlumno.css';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiFileText, FiLogOut, FiGrid } from 'react-icons/fi';

// Crear el contexto
const NotificationContext = createContext();

const SidebarAlumno = () => {
  const { logoutUser, authTokens } = useAuth();
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  // Función que obtiene las notificaciones
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/mensajes/', {
          headers: {
            Authorization: `Bearer ${authTokens.refresh}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener notificaciones');
        
        const data = await response.json();
        const unreadCount = data.filter(notif => !notif.visto).length;
        setNewNotificationsCount(unreadCount);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [authTokens]);

  // Proveer el valor del contexto
  return (
    <NotificationContext.Provider value={newNotificationsCount}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h4 className="h4-sidebar">TUP</h4>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/alumno/inicio" className="sidebar-link" activeclassname="active">
            <FiHome className="icon" /> Inicio
          </NavLink>
          <NavLink to="/alumno/mensajes" className="sidebar-link" activeclassname="active">
            <FiMail className="icon" /> Notificaciones
            {newNotificationsCount > 0 && (
              <span className="notification-badge">{newNotificationsCount}</span>
            )}
          </NavLink>
          <NavLink to="/alumno/firmarCompromiso" className="sidebar-link" activeclassname="active">
            <FiFileText className="icon" /> Compromiso de Pago
          </NavLink>
          <NavLink to="/alumno/tramites" className="sidebar-link" activeclassname="active">
            <FiGrid className="icon" /> Trámites
          </NavLink>
          <button onClick={logoutUser} className="sidebar-link logout-button">
            <FiLogOut className="icon" /> Logout
          </button>
        </nav>
      </div>
    </NotificationContext.Provider>
  );
};

export default SidebarAlumno;