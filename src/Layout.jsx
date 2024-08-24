import React from 'react';
import Sidebar from './pages/coordinador/SidebarCoordinador';
import { FaRegCircleUser } from "react-icons/fa6";
import './Layout.css';

const Layout = ({ children, loggedUser }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <div className="header d-flex justify-content-end align-items-center">
          <span className="logged-user"><FaRegCircleUser className='icono-usuario'/></span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;