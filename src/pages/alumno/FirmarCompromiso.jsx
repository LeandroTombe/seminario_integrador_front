import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir
import Layout from "../../LayoutAlumno";
import { useAuth } from "../../context/AuthContext";
import InfoCompromiso from '../../components/InfoCompromiso';
import Table from 'react-bootstrap/Table';

const FirmarCompromiso = () => {
  const { authTokens } = useAuth();
  const navigate = useNavigate(); // Define navigate para redirigir
  const [pdfUrl, setPdfUrl] = useState(null);
  const [compromiso, setCompromiso] = useState([]);
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

  const handleSign = async () => {
    const confirmed = window.confirm("¿Estás seguro de firmar el compromiso de pago?");
    if (!confirmed) {
      return;
    }

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
  
      alert('Compromiso firmado exitosamente');

      navigate('/alumno/inicio', { state: { successMessage: "Compromiso de pago firmado exitosamente" } });
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Error al firmar el compromiso: ${error.message}`);
    }
  };

  // Función para formatear fechas a solo mes y día
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Ajustar la fecha para evitar el desfase de zona horaria
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return adjustedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
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
              </div>
            )}
            <InfoCompromiso compromiso = {compromiso[0]}/>
            
            <br />
            <h4>Firma del compromiso de pago:</h4>
            {existeFirma.firmado ? (
                <p>Ya has firmado el compromiso de pago. Fecha de firma: {formatDate(existeFirma.firmado)}</p>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSign}
                >
                  Firmar Compromiso
                </button>
              </>
            )}
          </>
        ) : (
          <p>No se ha encontrado un compromiso para el año y cuatrimestre actual</p>
        )}
        <br /><br />
      </div>
    </Layout>
  );
};

export default FirmarCompromiso;