import Sidebar from "./SidebarCoordinador";
import './Inicio.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faChartLine, faCogs, faSearch } from '@fortawesome/free-solid-svg-icons';
import SidebarCoordinador from "./SidebarCoordinador";

function CargarCompromiso() {

  return (
    <>
    <div> 
      <Sidebar/>
        <div className="container">
          <div className="content">
            <h1>Bienvenido</h1>
            <div className="search-bar">
              <input type="text" id="search-input" placeholder="Buscar..." />
              <button type="button"><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }

  export default CargarCompromiso