import { useState, useEffect } from 'react';
import SeccionConfiguracion from "../../components/SeccionConfiguracion";
import Sidebar from "./SidebarCoordinador";
import ImportarUsuarios from "../importaciones/ImportarUsuarios";
import './Configuracion.css'

function Configuracion() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/compromisoActual/');
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    // A la SeccionConfiguracion se le tiene que pasar el valorInicial que es el valor que vamos a leer desde el servidor segun corresponda
    return (
      <div>
      <Sidebar/>
      
      <div className="contentConfig">
        <div className="containerConfig">
          <h2>Compromiso de pago Actual</h2>
          <br />
          <SeccionConfiguracion texto="Valor de matricula" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_matricula}</li>))}/>
          <SeccionConfiguracion texto="Valor de cuota completa" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_completo}</li>))}/>
          <SeccionConfiguracion texto="Valor de cuota reducida" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_reducido}</li>))}/>
          <SeccionConfiguracion texto="Valor de primer mora completa" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_pri_venc_comp}</li>))}/>
          <SeccionConfiguracion texto="Valor de segunda mora completa" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_seg_venc_comp}</li>))}/>
          <SeccionConfiguracion texto="Valor de primer mora reducida" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_pri_venc_red}</li>))}/>
          <SeccionConfiguracion texto="Valor de segunda mora reducida" valorInicial={data.map((item) => (<li key={item.id}>{item.importe_seg_venc_red}</li>))}/>
          <button>Cargar nuevo compromiso de pago</button>
          <br />
          <button>Ver historial de compromisos de pago</button>
        </div>
        
      </div>
      </div>
    )
  }

  export default Configuracion
  