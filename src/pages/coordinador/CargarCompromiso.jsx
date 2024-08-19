import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./SidebarCoordinador";
import './Inicio.css';

function CargarCompromiso() {
  // Calcular el año actual y el semestre actual
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() devuelve el mes en base 0 (0=Enero)
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
    importe_seg_venc_red: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleConfirm = (message, callback) => {
    if (window.confirm(message)) {
      callback();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleConfirm(
      '¿Estás seguro de que deseas guardar el compromiso de pago?',
      async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/parametrosCompromiso/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            throw new Error('Error al guardar el compromiso de pago');
          }

          // Muestra el mensaje de éxito y redirige a la página de compromiso con el mensaje
          setSuccessMessage('Compromiso cargado exitosamente');
          setError(null); // Limpiar cualquier mensaje de error
          
          navigate('/coordinador/configuracion/compromiso', { state: { successMessage: 'Compromiso cargado exitosamente' } });
        } catch (error) {
          setError(error.message);
          setSuccessMessage(''); // Limpiar el mensaje de éxito si ocurre un error
        }
      }
    );
  };

  const handleCancel = () => {
    handleConfirm(
      '¿Estás seguro de que deseas cancelar?',
      () => navigate('/coordinador/configuracion/compromiso')
    );
  };

  return (
    <>
      <Sidebar/>
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
                required
              />
            </div>
            <div className="d-grid gap-2 d-md-block">
              <button type="submit" className="btn btn-primary">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </>
  );
}

export default CargarCompromiso;