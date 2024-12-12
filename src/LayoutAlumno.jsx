import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './pages/alumno/SidebarAlumno';
import { FaRegCircleUser } from "react-icons/fa6";
import './Layout.css';
import { useAuth } from "./context/AuthContext";

const Layout = ({ children }) => {
  const { user } = useAuth(); // Acceder a la información del usuario

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
          <div className="header d-flex justify-content-end align-items-center">
            <Link to="/alumno/perfil" className="me-3 user-name no-underline"> {/* Redirigir al perfil */}
              <span className="me-3 user-name">{user ? user.nombre : "Usuario Desconocido"}</span> {/* Muestra el nombre del usuario */}
              <span className="logged-user"><FaRegCircleUser className='icono-usuario'/></span>
            </Link>
          </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;