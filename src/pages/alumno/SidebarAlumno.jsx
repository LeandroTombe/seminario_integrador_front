import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './SidebarAlumno.css';
import '../../assets/logout-button.css';

const SidebarAlumno = () => {
  const { logoutUser } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menú</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/alumno/inicio" className="sidebar-link" activeclassname="active">
          <i className="icon">🏠</i> Inicio
        </NavLink>
        <NavLink to="/alumno/mensajes" className="sidebar-link" activeclassname="active">
          <i className="icon">📧</i> Mensajes
        </NavLink>
        <NavLink to="/alumno/tramites" className="sidebar-link" activeclassname="active">
          <i className="icon">📊</i> Tramites
        </NavLink>
        <button onClick={logoutUser} className="sidebar-link logout-button">
          <i className="icon">🔒</i> Logout
        </button>
      </nav>
    </div>
  );
};

export default SidebarAlumno;