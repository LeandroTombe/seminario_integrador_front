import SeccionConfiguracion from "../../components/SeccionConfiguracion";
import Sidebar from "../../components/Sidebar";
import ImportarUsuarios from "../importaciones/ImportarUsuarios";
import './Configuracion.css'

function Configuracion() {

    // A la SeccionConfiguracion se le tiene que pasar el valorInicial que es el valor que vamos a leer desde el servidor segun corresponda
    return (
      <div>
      <Sidebar/>
      
      <div className="contentConfig">
        <div className="containerConfig">
          <SeccionConfiguracion texto="Valor de matricula" valorInicial={25000}/>
          <SeccionConfiguracion texto="Valor de cuota completa" valorInicial={20000}/>
          <SeccionConfiguracion texto="Valor de cuota reducida" valorInicial={15000}/>
          <SeccionConfiguracion texto="Valor de primer mora" valorInicial={1000}/>
          <SeccionConfiguracion texto="Valor de segunda mora" valorInicial={3000}/>
          <ImportarUsuarios></ImportarUsuarios>
        </div>
      </div>
      </div>
    )
  }

  export default Configuracion
  