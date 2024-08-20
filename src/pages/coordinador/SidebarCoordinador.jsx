import { NavLink } from 'react-router-dom';
import './SidebarCoordinador.css';
import { useAuth } from '../../context/AuthContext';
import '../../assets/logout-button.css';

const SidebarCoordinador = () => {
  const { logoutUser } = useAuth();


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menú</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/coordinador/inicio" className="sidebar-link" activeClassName="active">
          <i className="icon">🏠</i> Inicio
        </NavLink>
        <NavLink to="/coordinador/mensajes" className="sidebar-link" activeClassName="active">
          <i className="icon">📧</i> Mensajes
        </NavLink>
        <NavLink to="/coordinador/reportes" className="sidebar-link" activeClassName="active">
          <i className="icon">📊</i> Reportes
        </NavLink>
        <NavLink to="/coordinador/configuracion" className="sidebar-link" activeClassName="active">
          <i className="icon">⚙️</i> Configuración
        </NavLink>
        <NavLink to="/coordinador/importaciones-validas" className="sidebar-link" activeClassName="active">
          <i className="icon">⚙️</i> Importaciones
        </NavLink>
        <button onClick={logoutUser} className="sidebar-link logout-button">
          <i className="icon">🔒</i> Logout
        </button>
      </nav>
    </div>
  );
};

export default SidebarCoordinador;