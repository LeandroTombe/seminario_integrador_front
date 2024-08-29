import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InfoCompromiso from "../../../components/InfoCompromiso";
import Sidebar from "../SidebarCoordinador";
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Compromiso.css';
import Layout from '../../../Layout'

function Compromiso() {
  const [data, setData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
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
        if (result[0] && result[0].compromiso_contenido) {
          setPdfUrl(result[0].compromiso_contenido);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const handleEditarCompromiso = () => {
    navigate('/coordinador/configuracion/compromiso/actual/editar', {
      state: { compromiso: data[0] },
    });
  };

  const handleVisualizarPDF = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Layout>
        <h1>Compromiso de Pago Actual</h1>
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        <div className="containerConfig">
          {data.length === 0 ? (
            <p>No existe un compromiso de pago cargado para el año y cuatrimestre actual.</p>
          ) : (
            <div className='conteinerInfo'>
              <InfoCompromiso compromiso={data[0]}/>

              {pdfUrl && (
                <div className="mt-3">
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleVisualizarPDF}
                  >
                    Visualizar PDF
                  </button>
                </div>
              )}

              <div className="conteinerBotones">
                <button className="btn btn-primary me-3" type="button" onClick={handleEditarCompromiso}>Modificar Compromiso de Pago</button>
              </div>
            </div>
          )}
        </div>

      {/* Modal para mostrar el PDF */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Compromiso de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl ? (
            <iframe 
              src={`http://127.0.0.1:8000${pdfUrl}`} 
              width="100%" 
              height="500px" 
              title="Compromiso de Pago PDF"
            />
          ) : (
            <p>No se pudo cargar el PDF.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default Compromiso;