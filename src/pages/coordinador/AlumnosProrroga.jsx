import Sidebar from "./SidebarCoordinador";
import "./Inicio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelope,
  faChartLine,
  faCogs,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import List from "./List";
import Carrusel from "./Carrusel";
import React from "react";

function AlumnosProrroga() {
  const matriz = [
    ["DATOS DE PRUEBA", "-"],
    ["DATOS DE PRUEBA", "-"],
    ["DATOS DE PRUEBA", "-"],
  ];
  return (
    <>
      <div>
        <Sidebar />
        <div className="content">
          <h1>Bienvenido</h1>
          <div className="search-bar">
            <input type="text" id="search-input" placeholder="Buscar..." />
            <button type="button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div>
            <Carrusel
              alumnosEquivalencias="22"
              alumnosInhabilitados="25"
              alumnosTotal="47"
              pagos="103"
              pagosPendientes="43"
            />
            <h3>Estado de cuenta</h3>
            <List
              data={matriz}
              headerL={[
                "Legajo",
                "Apellido",
                "nombre",
                "DNI",
                "Correo",
                "Comision",
                "Fecha de solicitud",
                "estado",
                "plazo",
                "motivos de prorroga",
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AlumnosProrroga;
