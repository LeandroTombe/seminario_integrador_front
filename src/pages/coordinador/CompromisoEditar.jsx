import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './SidebarCoordinador';
import './Compromiso.css';
import { Modal, Button } from 'react-bootstrap';

function CompromisoEditar() {
  const location = useLocation();
  const navigate = useNavigate();
  const compromiso = location.state?.compromiso;

  const [formData, setFormData] = useState({
    año: '',
    cuatrimestre: '',
    importe_matricula: '',
    importe_completo: '',
    importe_reducido: '',
    importe_pri_venc_comp: '',
    importe_seg_venc_comp: '',
    importe_pri_venc_red: '',
    importe_seg_venc_red: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null); // Estado para el PDF original
  const [newPdfPreview, setNewPdfPreview] = useState(null); // Estado para el nuevo PDF
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [pdfSource, setPdfSource] = useState(null); // Estado para el PDF mostrado en el modal

  useEffect(() => {
    if (compromiso) {
      setFormData({
        año: compromiso.año,
        cuatrimestre: compromiso.cuatrimestre,
        importe_matricula: compromiso.importe_matricula,
        importe_completo: compromiso.importe_completo,
        importe_reducido: compromiso.importe_reducido,
        importe_pri_venc_comp: compromiso.importe_pri_venc_comp,
        importe_seg_venc_comp: compromiso.importe_seg_venc_comp,
        importe_pri_venc_red: compromiso.importe_pri_venc_red,
        importe_seg_venc_red: compromiso.importe_seg_venc_red,
      });
      if (compromiso.compromiso_contenido) {
        setPdfPreview(`http://127.0.0.1:8000${compromiso.compromiso_contenido}`); // Establece la previsualización del PDF original
      }
    }
  }, [compromiso]);

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
      setNewPdfPreview(URL.createObjectURL(file)); // Establece la previsualización del nuevo PDF
      setError(null);
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
    handleConfirm(
      '¿Estás seguro de que deseas guardar los cambios en el compromiso de pago?',
      async () => {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(key, formData[key]);
        });
        if (pdfFile) {
          formDataToSend.append('compromiso_contenido', pdfFile);
        }

        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/parametrosCompromisoEditar/', {
            method: 'PUT',
            body: formDataToSend,
          });

          if (!response.ok) {
            throw new Error('Error al actualizar el compromiso de pago');
          }

          setSuccessMessage('Compromiso actualizado con éxito');
          setError(null);
          
          navigate('/coordinador/configuracion/compromiso/actual', { state: { successMessage: 'Compromiso actualizado con éxito' } });
        } catch (error) {
          setError(error.message);
          setSuccessMessage('');
        }
      }
    );
  };

  const handleCancel = () => {
    handleConfirm(
      '¿Estás seguro de que deseas cancelar?',
      () => navigate('/coordinador/configuracion/compromiso/actual')
    );
  };

  const handleShowModal = (urlPdf) => {
    setPdfSource(urlPdf); // Asignar el nuevo PDF o el existente
    setShowModal(true);
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h1>Editar Compromiso de Pago</h1>
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
                    readOnly
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="cuatrimestre" className="form-label">Cuatrimestre</label>
                    <input
                    type="text"
                    className="form-control"
                    id="cuatrimestre"
                    name="cuatrimestre"
                    value={formData.cuatrimestre}
                    readOnly
                    />
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
              <label htmlFor="importe_pri_venc_comp" className="form-label">Valor de primer mora completa</label>
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
              <label htmlFor="importe_seg_venc_comp" className="form-label">Valor de segunda mora completa</label>
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
              <label htmlFor="importe_pri_venc_red" className="form-label">Valor de primer mora reducida</label>
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
              <label htmlFor="importe_seg_venc_red" className="form-label">Valor de segunda mora reducida</label>
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

            {/* Botón para visualizar el PDF original si existe */}
            {pdfPreview && (
              <div className="mt-3">
                <Button variant="btn btn-secondary" onClick={() => handleShowModal(pdfPreview)}>
                  Visualizar PDF 
                </Button>
              </div>
            )}

            {/* Campo para cargar un nuevo PDF */}
            <br />
            <div className="mb-3">
              <label htmlFor="compromiso_contenido" className="form-label">Modificar PDF del compromiso de pago</label>
              <input
                type="file"
                className="form-control"
                id="compromiso_contenido"
                accept="application/pdf"
                onChange={handlePdfChange}
              />
              {/* Mostrar previsualización del nuevo PDF si se selecciona uno */}
              {newPdfPreview && (
                <div className="mt-3">
                  <Button variant="secondary" onClick={() => handleShowModal(newPdfPreview)}>
                    Visualizar nuevo archivo PDF
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
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        </div>
      </div>

      {/* Modal para previsualizar el PDF */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Visualización del PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mostrar previsualización del archivo original o el nuevo según corresponda */}
          <iframe src={pdfSource} width="100%" height="500px" 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CompromisoEditar;