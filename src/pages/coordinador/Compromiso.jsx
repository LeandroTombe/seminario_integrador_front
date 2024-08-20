import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useNavigate
import SeccionCompromiso from "../../components/SeccionCompromiso";
import Sidebar from "./SidebarCoordinador";
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import './Compromiso.css'

function Compromiso() {
  const [data, setData] = useState([]);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redireccionar
  const location = useLocation();
  const successMessage = location.state?.successMessage || '';

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

  const handleEditarCompromiso = () => {
    navigate('/coordinador/configuracion/compromiso/actual/editar', {
      state: { compromiso: data[0] }, // Pasa los datos del compromiso como estado
    });
  };

  return (
    <>
      <Sidebar/>
      <div className="content">
        <h1>Compromiso de Pago Actual</h1>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        <div className="containerConfig">
          {data.length === 0 ? (
            <p>No existe un compromiso de pago cargado para el año y cuatrimestre actual.</p>
          ) : (
            <div className='conteinerInfo'>
              <Badge bg="primary">Año: {data[0].año} Cuatrimestre: {data[0].cuatrimestre}</Badge>
              <SeccionCompromiso texto="Valor de matricula" valorInicial={data[0].importe_matricula} />
              <SeccionCompromiso texto="Valor de cuota completa" valorInicial={data[0].importe_completo} />
              <SeccionCompromiso texto="Valor de cuota reducida" valorInicial={data[0].importe_reducido} />
              <SeccionCompromiso texto="Valor de primer mora completa" valorInicial={data[0].importe_pri_venc_comp} />
              <SeccionCompromiso texto="Valor de segunda mora completa" valorInicial={data[0].importe_seg_venc_comp} />
              <SeccionCompromiso texto="Valor de primer mora reducida" valorInicial={data[0].importe_pri_venc_red} />
              <SeccionCompromiso texto="Valor de segunda mora reducida" valorInicial={data[0].importe_seg_venc_red} />
              <div className="conteinerBotones">
                <button className="btn btn-primary me-3" type="button" onClick={handleEditarCompromiso}>Editar</button>
              </div>
            </div>
          )}
        </div>  
      </div>
    </>
  );
}

export default Compromiso;