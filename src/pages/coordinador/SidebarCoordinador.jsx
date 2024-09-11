import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SidebarCoordinador.css';
import { useAuth } from '../../context/AuthContext';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiBarChart2, FiSettings, FiLogOut, FiChevronRight } from 'react-icons/fi';

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
        <h4 className='h4-sidebar'>TUP
        <button class="toggle-btn" onclick="toggleNavbar()">☰</button>
        </h4>
      </div>
      <nav className="sidebar-nav navbar-menu">
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
                <FiChevronRight className="icon" /> Compromiso de Pago
              </button>
              {isCompromisoOpen && (
                <div className="compromiso-options">
                  <NavLink to="/coordinador/configuracion/compromiso/actual" className="sidebar-link" activeclassname="active">
                    <FiChevronRight className="icon" /> Valores y Compromiso de Pago Actual
                  </NavLink>
                  <NavLink to="/coordinador/configuracion/compromiso/cargar" className="sidebar-link" activeclassname="active">
                    <FiChevronRight className="icon" /> Nuevos Valores y Compromiso de Pago
                  </NavLink>
                  <NavLink to="/coordinador/configuracion/compromiso/historial" className="sidebar-link" activeclassname="active">
                    <FiChevronRight className="icon" /> Historial de Valores y Compromisos de Pago
                  </NavLink>
                </div>
              )}
              <NavLink to="/coordinador/configuracion/importaciones-validas" className="sidebar-link" activeclassname="active">
                <FiChevronRight className="icon" /> Importar Alumnos
              </NavLink>
              <NavLink to="/coordinador/configuracion/importar-pagos" className="sidebar-link" activeclassname="active">
                <FiChevronRight className="icon" /> Importar Pagos
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

function toggleNavbar() {
  var navbarMenu = document.getElementById("navbar-menu");
  navbarMenu.classList.toggle("active"); // Alterna la clase 'active' para mostrar u ocultar el menú
}

export default SidebarCoordinador;