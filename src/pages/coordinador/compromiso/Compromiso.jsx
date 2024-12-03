import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InfoCompromiso from "../../../components/InfoCompromiso";
import 'bootstrap/dist/css/bootstrap.min.css';
import CompromisoEditar from './CompromisoEditar'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Compromiso.css';

function Compromiso({ setActiveTab }) {
  const [data, setData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false); // Nuevo estado para alternar vistas
  const [successMessage, setSuccessMessage] = useState(false); // Nuevo estado para alternar vistas
  const navigate = useNavigate();

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

  const handleEditarCompromiso = () => setEditando(true); // Cambia a modo edición

  const handleCancelarEdicion = (message) => {
    setSuccessMessage(message); // Establecer el mensaje de éxito en el estado
    setEditando(false); // O lo que necesites hacer para salir del modo de edición
  };

  const handleVisualizarPDF = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}

      <div className="containerConfig">
        {editando ? (
          <CompromisoEditar compromiso={data[0]} onCancel={handleCancelarEdicion} />
        ) : data.length === 0 ? (
          <>
              <p>No existe un compromiso de pago para el año y cuatrimestre actual.</p>
              <div className="containerBotones">
                  <button
                      className="btn btn-primary me-3"
                      type="button"
                      onClick={() => setActiveTab('nuevo')} // Cambia a la pestaña 'nuevo'
                  >
                      Cargar Compromiso
                  </button>
              </div>
          </>
      ) : (
          <div className="conteinerInfo">
            <InfoCompromiso compromiso={data[0]} />

            {pdfUrl && (
              <div className="mt-3">
                <button className="btn btn-secondary" onClick={handleVisualizarPDF}>
                  Visualizar PDF
                </button>
              </div>
            )}

            {false && (
                <div className="conteinerBotones">
                    <button className="btn btn-primary me-3" type="button" onClick={handleEditarCompromiso}>
                        Modificar Valores
                    </button>
                </div> 
            )
            }
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
    </>
  );
}

export default Compromiso;