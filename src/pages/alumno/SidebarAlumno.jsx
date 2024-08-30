import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './SidebarAlumno.css';
import '../../assets/logout-button.css';
import { FiHome, FiMail, FiFileText , FiLogOut, FiGrid} from 'react-icons/fi';

const SidebarAlumno = () => {
  const { logoutUser } = useAuth();

  return (
    <div className="sidebar-alumno">
      <div className="sidebar-header-alumno">
        <h4 className='h4-sidebar-alumno'>TUP</h4>
      </div>
      <nav className="sidebar-nav-alumno">
        <NavLink to="/alumno/AlumnoInicio" className="sidebar-link-alumno" activeclassname="active">
          <FiHome className="icon-alumno" /> Inicio
        </NavLink>
        <NavLink to="/alumno/AlumnoMensajes" className="sidebar-link-alumno" activeclassname="active">
          <FiMail className="icon-alumno" /> Mensajes
        </NavLink>
        <NavLink to="/alumno/AlumnoCompromiso" className="sidebar-link-alumno" activeclassname="active">
          <FiFileText className="icon-alumno" /> Compromiso de Pago
        </NavLink>
        <NavLink to="/alumno/AlumnoTramites" className="sidebar-link-alumno" activeclassname="active">
          <FiGrid className="icon-alumno" /> Trámites
        </NavLink>
        <button onClick={logoutUser} className="sidebar-link logout-button-alumno">
          <FiLogOut className="icon-alumno" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default SidebarAlumno;