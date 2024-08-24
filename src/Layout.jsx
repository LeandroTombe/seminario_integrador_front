import React from 'react';
import Sidebar from './pages/coordinador/SidebarCoordinador';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;