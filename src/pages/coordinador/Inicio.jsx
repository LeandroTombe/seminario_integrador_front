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
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CardInicio from "./CardInicio";

// SIMULA ALUMNOS INSCRIPTOS
// NOTAS
// falta un buscador en la lista
// que se pueda seleccionar que columnas ver
function Inicio() {
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

          <div className="conteiner-cards">
            <CardInicio title="prueba" text="prueba"></CardInicio>
          </div>

          <div className="conteiner-list">
            <h3>Estado de cuenta</h3>
            <List
              data={matriz}
              headerL={[
                "Legajo",
                "Nombre",
                "Monto",
                "Mora",
                "Total",
                "Pagado",
                "Estado",
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Inicio;
