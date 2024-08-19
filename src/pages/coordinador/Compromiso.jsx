import { useState, useEffect } from 'react';
import SeccionConfiguracion from "../../components/SeccionConfiguracion";
import Sidebar from "./SidebarCoordinador";
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import './Compromiso.css'

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

  /*
  if (loading) {
      return <div className="content"><p>Cargando...</p></div>;
    }

    if (error) {
      return <div className="content"><p>Error: {error}</p></div>;
    }
  */


  //Acomodar mejor el lugar donde se informa el año y el cuatrimestre del compromiso
  return (
    <>
      <Sidebar/>
      <div className="content">
        <h1>Compromiso de pago</h1>
        <div className="containerConfig">
          <h1>Compromiso de pago actual</h1>
          {data.length === 0 ? (
            <p>No existe un compromiso de pago cargado para el año y cuatrimestre actual.</p>
          ) : (
            <div>
              <Badge bg="primary">Año: {data[0].año} Cuatrimestre: {data[0].cuatrimestre}</Badge>
              <SeccionConfiguracion texto="Valor de matricula" valorInicial={data[0].importe_matricula} />
              <SeccionConfiguracion texto="Valor de cuota completa" valorInicial={data[0].importe_completo} />
              <SeccionConfiguracion texto="Valor de cuota reducida" valorInicial={data[0].importe_reducido} />
              <SeccionConfiguracion texto="Valor de primer mora completa" valorInicial={data[0].importe_pri_venc_comp} />
              <SeccionConfiguracion texto="Valor de segunda mora completa" valorInicial={data[0].importe_seg_venc_comp} />
              <SeccionConfiguracion texto="Valor de primer mora reducida" valorInicial={data[0].importe_pri_venc_red} />
              <SeccionConfiguracion texto="Valor de segunda mora reducida" valorInicial={data[0].importe_seg_venc_red} />
            </div>
          )}
          <div className="d-grid gap-2 d-md-block">
            <button className="btn btn-primary me-3" type="button">Cargar nuevo compromiso de pago</button>
            <button className="btn btn-primary" type="button">Ver historial de compromisos de pago</button>
          </div>
        </div>  
      </div>
    </>
  );
}

export default Configuracion; 