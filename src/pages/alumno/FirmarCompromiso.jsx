import React, { useEffect, useState } from 'react';
import Layout from "../../LayoutAlumno";
import { useAuth } from "../../context/AuthContext";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InfoCompromiso from '../../components/InfoCompromiso'

const FirmarCompromiso = () => {
  const { authTokens } = useAuth(); // Acceder a la información del usuario y tokens
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [compromiso, setCompromiso] = useState([]);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const fetchCompromiso = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/compromisoActual/', {
        });
        const compromiso = await response.json();
        if (!response.ok) {
          throw new Error(response.error);
        }
        setCompromiso(compromiso);
        if (compromiso[0] && compromiso[0].compromiso_contenido) {
          setPdfUrl(compromiso[0].compromiso_contenido);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCompromiso();
  }, [authTokens]);

  const handleSign = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/estudiantes/firmaCompromiso/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.refresh}`, // Asegúrate de usar el token de acceso, no el de refresco
        },
        body: JSON.stringify({
          año: compromiso[0].año,
          cuatrimestre: compromiso[0].cuatrimestre,
        }),
      });
  
      // Leer la respuesta en formato JSON
      const data = await response.json();
  
      if (!response.ok) {
        // Si la respuesta no es exitosa, lanza un error con el mensaje del backend
        throw new Error(data.error || 'Error al firmar el compromiso');
      }
  
      setIsSigned(true);
      alert('Compromiso firmado exitosamente');
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Error al firmar el compromiso: ${error.message}`); // Mostrar el mensaje de error al usuario
    }
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
      <div className="containerConfig">
      {compromiso.length > 0 ? (
        <>
          <InfoCompromiso compromiso={compromiso[0]} />

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

          <div>
            <input 
              type="checkbox" 
              id="firmarCompromiso" 
              checked={isSigned} 
              onChange={handleSign} 
              disabled={isSigned} // Deshabilita la casilla si ya está firmada
            />
            <label htmlFor="firmarCompromiso"> Acepto los terminos y condiciones del compromiso de pago</label>
          </div>

        </>
      ) : (
        <p>No se ha encontrado ningún compromiso.</p>
      )}

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
      </div>
    </Layout>
  );
};

export default FirmarCompromiso;