import { NavLink } from 'react-router-dom';
import './SidebarCoordinador.css';
import { useAuth } from '../../context/AuthContext';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';

const SidebarCoordinador = () => {
  const { logoutUser } = useAuth();


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
        <NavLink to="/coordinador/configuracion" className="sidebar-link" activeClassName="active">
          <FiSettings className="icon" /> Configuración
        </NavLink>
        <NavLink to="/coordinador/importaciones-validas" className="sidebar-link" activeClassName="active">
          <FiSettings className="icon" /> Importaciones
        </NavLink>
        <button onClick={logoutUser} className="sidebar-link logout-button">
          <FiLogOut className="icon" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default SidebarCoordinador;