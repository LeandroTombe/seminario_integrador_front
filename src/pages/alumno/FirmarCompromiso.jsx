import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import Layout from "../../LayoutAlumno";
import { useAuth } from "../../context/AuthContext";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InfoCompromiso from '../../components/InfoCompromiso';

const FirmarCompromiso = () => {
  const { authTokens } = useAuth();
  const navigate = useNavigate(); // Define navigate para redirigir
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [compromiso, setCompromiso] = useState([]);
  const [isSigned, setIsSigned] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', dni: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [existeFirma, setExisteFirma] = useState([]);

  useEffect(() => {
    const fetchCompromiso = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/compromisoActual/');
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

  useEffect(() => {
    const fetchExisteFirmaCompromiso = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/existenciaFirmaAlumnoCompromisoActual/', {
          headers: {
              'Authorization': `Bearer ${authTokens.refresh}`, 
          },
      });
        
        if (!response.ok) {
          throw new Error(response.error);
        }
        const existeFirma = await response.json();
        setExisteFirma(existeFirma);
        console.log(existeFirma.firmado)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchExisteFirmaCompromiso();
  }, [authTokens]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      const newFormData = { ...prevFormData, [name]: value };
      const isValid = Object.values(newFormData).every(field => field.trim() !== '');
      setIsFormValid(isValid);
      return newFormData;
    });
  };

  const handleSign = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/estudiantes/firmaCompromiso/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.refresh}`,
        },
        body: JSON.stringify({
          año: compromiso[0].año,
          cuatrimestre: compromiso[0].cuatrimestre,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error al firmar el compromiso');
      }
  
      setIsSigned(true);
      alert('Compromiso firmado exitosamente');

      navigate('/alumno/inicio', { state: { successMessage: "Compromiso de pago firmado exitosamente" } });
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Error al firmar el compromiso: ${error.message}`);
    }
  };

  const handleShowModal = () => {
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
            {pdfUrl && (
              <div className="mb-3">
                <iframe 
                  src={`http://127.0.0.1:8000${pdfUrl}`} 
                  width="100%" 
                  height="600px" 
                  title="Compromiso de Pago PDF"
                />
                <div className="mt-3 d-flex justify-content-center">
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleShowModal}
                  >
                    Ver resumen de valores
                  </button>
                </div>
              </div>
            )}
            
            <br />
            <h4>Firma del compromiso de pago:</h4>
            {existeFirma.firmado ? (
              <p>Ya has firmado el compromiso de pago.</p>
            ) : (
              <>
                <p className="mt-4">Ingresa tus datos para realizar la firma del compromiso de pago</p>
                <form>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      value={formData.nombre}
                      onChange={handleFormChange}
                      className="form-control" 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input 
                      type="text" 
                      id="apellido" 
                      name="apellido" 
                      value={formData.apellido}
                      onChange={handleFormChange}
                      className="form-control" 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dni" className="form-label">DNI</label>
                    <input 
                      type="text" 
                      id="dni" 
                      name="dni" 
                      value={formData.dni}
                      onChange={handleFormChange}
                      className="form-control" 
                    />
                  </div>
                  <div>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSign}
                      disabled={!isFormValid || isSigned} 
                    >
                      Firmar Compromiso
                    </button>
                  </div>
                </form>
              </>
            )}
          </>
        ) : (
          <p>No se ha encontrado ningún compromiso.</p>
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Resumen de Valores de Cuotas y Matriculas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {compromiso.length > 0 && <InfoCompromiso compromiso={compromiso[0]} />}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default FirmarCompromiso;