import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMensajes } from '../../context/MensajesContext'; // Usar el contexto
import { NavLink } from 'react-router-dom';
import './SidebarAlumno.css';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiFileText, FiLogOut, FiGrid } from 'react-icons/fi';


const SidebarAlumno = () => {
  const { logoutUser, authTokens } = useAuth();
  const { cantidadMensajesNoLeidos, cantidadNotificacionesNoVistas } = useMensajes(); // Consumir el contexto

  // Proveer el valor del contexto
  return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h4 className="h4-sidebar">TUP</h4>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/alumno/inicio" className="sidebar-link" activeclassname="active">
            <FiHome className="icon" /> Inicio
          </NavLink>
          <NavLink to="/alumno/mensajes" className="sidebar-link" activeclassname="active">
            <FiMail className="icon" /> Mensajes
            {(cantidadMensajesNoLeidos + cantidadNotificacionesNoVistas) > 0 && (
              <span className="notification-badge">{cantidadMensajesNoLeidos + cantidadNotificacionesNoVistas}</span>
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
  );
};

export default SidebarAlumno;