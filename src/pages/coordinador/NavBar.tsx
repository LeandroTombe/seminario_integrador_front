import React from "react";

function NavBar() {
  return (
    <ul className="nav nav-tabs bg-primary bg-dark.bg-gradient text-white">
      <li className="nav-item">
        <a className="nav-link active" aria-current="page" href="#">
          Inicio
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">
          Mensajes
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">
          Reportes
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled" aria-disabled="true">
          Configuracion
        </a>
      </li>
    </ul>
  );
}
export default NavBar;
