import React from 'react';
import Sidebar from './pages/coordinador/SidebarCoordinador';
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
          <span className="me-3 user-name">{user ? user.nombre : "Usuario Desconocido"}</span> {/* Muestra el nombre del usuario */}
          <span className="logged-user"><FaRegCircleUser className='icono-usuario'/></span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;