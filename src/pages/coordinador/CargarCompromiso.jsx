import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./SidebarCoordinador";
import './Compromiso.css';
import { Modal, Button } from 'react-bootstrap'; // Importa los componentes de Bootstrap

function CargarCompromiso() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; 
  const currentSemester = currentMonth <= 6 ? '1' : '2';

  const [formData, setFormData] = useState({
    año: currentYear,
    cuatrimestre: currentSemester,
    importe_matricula: '',
    importe_completo: '',
    importe_reducido: '',
    importe_pri_venc_comp: '',
    importe_seg_venc_comp: '',
    importe_pri_venc_red: '',
    importe_seg_venc_red: '',
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Convertir el valor a número
    const numericValue = Number(value);
  
    // Verificar si el valor es un número y no negativo
    if (!isNaN(numericValue) && numericValue >= 0) {
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      // Opcional: Manejar valores no válidos (por ejemplo, mostrar un mensaje de error)
      console.error("El valor ingresado no es válido o es negativo.");
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfPreview(URL.createObjectURL(file));
      setShowModal(true); // Mostrar el modal
      setError(null)
    } else {
      setError('Por favor, selecciona un archivo PDF válido.');
    }
  };

  const handleConfirm = (message, callback) => {
    if (window.confirm(message)) {
      callback();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleConfirm('¿Estás seguro de que deseas guardar el compromiso de pago?', async () => {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (pdfFile) {
        formDataToSend.append('compromiso_contenido', pdfFile);
      } else{
        setError('Por favor, selecciona un archivo PDF válido.');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/parametrosCompromiso/', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error('Error al guardar el compromiso de pago');
        }
        console.log([...formDataToSend.entries()]);
        setSuccessMessage('Compromiso cargado exitosamente');
        setError(null);
        navigate('/coordinador/configuracion/compromiso/actual', {
          state: { successMessage: 'Compromiso cargado exitosamente' },
        });
      } catch (error) {
        setError(error.message);
        setSuccessMessage('');
      }
    });
  };

  const handleCancel = () => {
    handleConfirm('¿Estás seguro de que deseas cancelar?', () => navigate('/coordinador/configuracion/compromiso/actual'));
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h1>Nuevo Compromiso de Pago</h1>
        <div className="containerConfig">
          <form onSubmit={handleSubmit}>
          <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="año" className="form-label">Año</label>
                <input
                  type="number"
                  className="form-control"
                  id="año"
                  name="año"
                  value={formData.año}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
              <label htmlFor="cuatrimestre" className="form-label">Cuatrimestre</label>
                <select
                  className="form-control"
                  id="cuatrimestre"
                  name="cuatrimestre"
                  value={formData.cuatrimestre}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un cuatrimestre</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="importe_matricula" className="form-label">Valor de matrícula</label>
              <input
                type="number"
                className="form-control"
                id="importe_matricula"
                name="importe_matricula"
                value={formData.importe_matricula}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="importe_completo" className="form-label">Valor de cuota completa</label>
              <input
                type="number"
                className="form-control"
                id="importe_completo"
                name="importe_completo"
                value={formData.importe_completo}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="importe_reducido" className="form-label">Valor de cuota reducida</label>
              <input
                type="number"
                className="form-control"
                id="importe_reducido"
                name="importe_reducido"
                value={formData.importe_reducido}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="importe_pri_venc_comp" className="form-label">Valor de primer vencimiento completo</label>
              <input
                type="number"
                className="form-control"
                id="importe_pri_venc_comp"
                name="importe_pri_venc_comp"
                value={formData.importe_pri_venc_comp}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="importe_seg_venc_comp" className="form-label">Valor de segundo vencimiento completo</label>
              <input
                type="number"
                className="form-control"
                id="importe_seg_venc_comp"
                name="importe_seg_venc_comp"
                value={formData.importe_seg_venc_comp}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="importe_pri_venc_red" className="form-label">Valor de primer vencimiento completo</label>
              <input
                type="number"
                className="form-control"
                id="importe_pri_venc_red"
                name="importe_pri_venc_red"
                value={formData.importe_pri_venc_red}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="importe_seg_venc_red" className="form-label">Valor de segundo vencimiento completo</label>
              <input
                type="number"
                className="form-control"
                id="importe_seg_venc_red"
                name="importe_seg_venc_red"
                value={formData.importe_seg_venc_red}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="contenido_compromiso" className="form-label">Cargar PDF del compromiso de pago</label>
              <input
                type="file"
                className="form-control"
                id="contenido_compromiso"
                accept="application/pdf"
                onChange={handlePdfChange}
                required
              />
              {/* Mostrar previsualización del nuevo PDF si se selecciona uno */}
                {pdfPreview && (
                <div className="mt-3">
                  <Button variant="secondary" onClick={() => setShowModal(true)}>
                    Visualizar PDF
                  </Button>
                </div>
              )}
            </div>
            
            <div className="d-grid gap-2 d-md-block">
              <button type="submit" className="btn btn-success">Guardar</button>
              <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
        
        {/* Modal para previsualizar el PDF */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Previsualización del PDF</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {pdfPreview && (
              <embed src={pdfPreview} width="100%" height="600px" type="application/pdf" />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default CargarCompromiso;