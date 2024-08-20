import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SidebarCoordinador.css';
import { useAuth } from '../../context/AuthContext';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const SidebarCoordinador = () => {
  const { logoutUser } = useAuth();
  const location = useLocation(); // Hook para obtener la ubicación actual
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCompromisoOpen, setIsCompromisoOpen] = useState(false);

  // Efecto para manejar el estado de despliegue de la sección Configuración y Compromiso de Pago basado en la ruta actual
  useEffect(() => {
    if (location.pathname.startsWith('/coordinador/configuracion')) {
      setIsConfigOpen(true);
      if (location.pathname.startsWith('/coordinador/configuracion/compromiso')) {
        setIsCompromisoOpen(true);
      } else {
        setIsCompromisoOpen(false);
      }
    } else {
      setIsConfigOpen(false);
      setIsCompromisoOpen(false);
    }
  }, [location.pathname]);

  const toggleConfig = () => {
    setIsConfigOpen(!isConfigOpen);
  };

  const toggleCompromiso = () => {
    setIsCompromisoOpen(!isCompromisoOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menú</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/coordinador/inicio" className="sidebar-link" activeclassname="active">
          <FiHome className="icon" /> Inicio
        </NavLink>
        <NavLink to="/coordinador/mensajes" className="sidebar-link" activeclassname="active">
          <FiMail className="icon" /> Mensajes
        </NavLink>
        <NavLink to="/coordinador/reportes" className="sidebar-link" activeclassname="active">
          <FiBarChart2 className="icon" /> Reportes
        </NavLink>
        <div>
          <button onClick={toggleConfig} className="sidebar-link">
            <FiSettings className="icon" /> Configuración
          </button>
          {isConfigOpen && (
            <div className="config-options">
              <button onClick={toggleCompromiso} className="sidebar-link">
                <FiSettings className="icon" /> Compromiso de Pago
              </button>
              {isCompromisoOpen && (
                <div className="compromiso-options">
                  <NavLink to="/coordinador/configuracion/compromiso/actual" className="sidebar-link" activeclassname="active">
                    <FiSettings className="icon" /> Compromiso Actual
                  </NavLink>
                  <NavLink to="/coordinador/configuracion/compromiso/cargar" className="sidebar-link" activeclassname="active">
                    <FiSettings className="icon" /> Nuevo Compromiso
                  </NavLink>
                  <NavLink to="/coordinador/configuracion/compromiso/historial" className="sidebar-link" activeclassname="active">
                    <FiSettings className="icon" /> Historial de Compromisos
                  </NavLink>
                </div>
              )}
              <NavLink to="/coordinador/configuracion/importaciones-validas" className="sidebar-link" activeclassname="active">
                <FiSettings className="icon" /> Importar Alumnos
              </NavLink>
              <NavLink to="/coordinador/configuracion/importar-pagos" className="sidebar-link" activeclassname="active">
                <FiSettings className="icon" /> Importar Pagos
              </NavLink>
            </div>
          )}
        </div>
        <button onClick={logoutUser} className="sidebar-link logout-button">
          <FiLogOut className="icon" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default SidebarCoordinador;