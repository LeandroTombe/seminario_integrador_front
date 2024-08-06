import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Menú</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/inicio" className="sidebar-link" activeClassName="active">
          <i className="icon">🏠</i> Inicio
        </NavLink>
        <NavLink to="/mensajes" className="sidebar-link" activeClassName="active">
          <i className="icon">📧</i> Mensajes
        </NavLink>
        <NavLink to="/reportes" className="sidebar-link" activeClassName="active">
          <i className="icon">📊</i> Reportes
        </NavLink>
        <NavLink to="/configuracion" className="sidebar-link" activeClassName="active">
          <i className="icon">⚙️</i> Configuración
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;