// SidebarCoordinador.js
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SidebarCoordinador.css';
import { useAuth } from '../../context/AuthContext';
import { useMensajes } from '../../context/MensajesContext'; // Usar el contexto
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiBarChart2, FiFileText, FiLogOut } from 'react-icons/fi';
import { IoSchoolOutline } from "react-icons/io5";
import { MdOutlinePayments } from "react-icons/md";

const SidebarCoordinador = () => {
  const { logoutUser } = useAuth();
  const location = useLocation();
  const { cantidadMensajesNoLeidos } = useMensajes(); // Consumir el contexto
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCompromisoOpen, setIsCompromisoOpen] = useState(false);

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
        <h4 className='h4-sidebar'>TUP</h4>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/coordinador/inicio" className="sidebar-link logout-button" activeclassname="active">
          <FiHome className="icon" /> Inicio
        </NavLink>
        <NavLink to="/coordinador/mensajes" className="sidebar-link logout-button" activeclassname="active">
          <FiMail className="icon" /> Mensajes {console.log(cantidadMensajesNoLeidos)}
          {cantidadMensajesNoLeidos > 0 && (
            <span className="notification-badge">{cantidadMensajesNoLeidos}</span>
          )}
        </NavLink>
        <NavLink to="/coordinador/reportes" className="sidebar-link logout-button" activeclassname="active">
          <FiBarChart2 className="icon" /> Reportes
        </NavLink>
        <NavLink to="/coordinador/compromiso" className="sidebar-link logout-button" activeclassname="active">
          <FiFileText className="icon" /> Compromiso de Pago
        </NavLink>
        <NavLink to="/coordinador/configuracion/importaciones-validas" className="sidebar-link" activeclassname="active">
          <IoSchoolOutline className="icon" /> Importar Alumnos
        </NavLink>
        <NavLink to="/coordinador/configuracion/importar-pagos" className="sidebar-link" activeclassname="active">
          <MdOutlinePayments className="icon" /> Importar Pagos
        </NavLink>
        <button onClick={logoutUser} className="sidebar-link logout-button">
          <FiLogOut className="icon" /> Cerrar Sesión
        </button>
      </nav>
    </div>
  );
};

export default SidebarCoordinador;