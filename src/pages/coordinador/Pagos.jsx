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

function Pagos() {
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
          <div>
            <Carrusel
              alumnosEquivalencias="22"
              alumnosInhabilitados="25"
              alumnosTotal="47"
              pagos="103"
              pagosPendientes="43"
            />
            <List
              data={matriz}
              headerL={[
                "Legajo",
                "Apellido",
                "nombre",
                "DNI",
                "Correo",
                "cuota",
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Pagos;
