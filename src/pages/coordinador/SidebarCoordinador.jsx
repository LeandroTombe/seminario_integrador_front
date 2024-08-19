import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SidebarCoordinador.css';
import { useAuth } from '../../context/AuthContext';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const SidebarCoordinador = () => {
  const { logoutUser } = useAuth();
  const location = useLocation();  // Hook para obtener la ubicación actual
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Efecto para manejar el estado de despliegue basado en la ruta actual
  useEffect(() => {
    if (location.pathname.startsWith('/coordinador/configuracion')) {
      setIsConfigOpen(true);
    } else {
      setIsConfigOpen(false);
    }
  }, [location.pathname]);

  const toggleConfig = () => {
    setIsConfigOpen(!isConfigOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menú</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/coordinador/inicio" className="sidebar-link" activeClassName="active">
          <FiHome className="icon" /> Inicio
        </NavLink>
        <NavLink to="/coordinador/mensajes" className="sidebar-link" activeClassName="active">
          <FiMail className="icon" /> Mensajes
        </NavLink>
        <NavLink to="/coordinador/reportes" className="sidebar-link" activeClassName="active">
          <FiBarChart2 className="icon" /> Reportes
        </NavLink>
        <div>
          <button onClick={toggleConfig} className="sidebar-link">
            <FiSettings className="icon" /> Configuración
          </button>
          {isConfigOpen && (
            <div className="config-options">
              <NavLink to="/coordinador/configuracion/compromiso" className="sidebar-link" activeClassName="active">
                <FiSettings className="icon" /> Compromiso de Pago
              </NavLink>
              <NavLink to="/coordinador/configuracion/importaciones-validas" className="sidebar-link" activeClassName="active">
                <FiSettings className="icon" /> Importar Alumnos
              </NavLink>
              <NavLink to="/coordinador/inicio" className="sidebar-link" activeClassName="active">
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