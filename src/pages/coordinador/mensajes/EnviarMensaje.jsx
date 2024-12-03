import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './EnviarMensaje.css';
import { useAuth } from "../../../context/AuthContext";

const EnviarMensajeMultidestinatario = () => {
  const { authTokens } = useAuth();
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [filtros, setFiltros] = useState({ materia: '', anio: '', buscar: '' });
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false); // Estado para mostrar/ocultar filtros

  useEffect(() => {
    const fetchDatosIniciales = async () => {
      try {
        const responseAlumnos = await axios.get('http://127.0.0.1:8000/api/v1/estudiantes/alumno/total-alumnos');
        const responseMaterias = await axios.get('http://127.0.0.1:8000/api/v1/estudiantes/materias/', {
          headers: {
            Authorization: `Bearer ${authTokens.refresh}`,
          },
        });
        setAlumnos(responseAlumnos.data);
        setAlumnosFiltrados(responseAlumnos.data);
        setMaterias(responseMaterias.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchDatosIniciales();
  }, [authTokens]);

  const actualizarFiltros = async (nuevoFiltro) => {
    const nuevosFiltros = { ...filtros, ...nuevoFiltro };
    setFiltros(nuevosFiltros);

    const queryParams = new URLSearchParams();
    if (nuevosFiltros.materia) queryParams.append("materia", nuevosFiltros.materia);
    if (nuevosFiltros.anio) queryParams.append("anio", nuevosFiltros.anio);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/materia-anio/?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${authTokens.refresh}`,
        },
      });

      const alumnosFiltradosPorBusqueda = nuevosFiltros.buscar
        ? response.data.filter((alumno) =>
            alumno.nombre.toLowerCase().includes(nuevosFiltros.buscar.toLowerCase()) ||
            alumno.apellido.toLowerCase().includes(nuevosFiltros.buscar.toLowerCase())
          )
        : response.data;

      setAlumnosFiltrados(alumnosFiltradosPorBusqueda);
    } catch (error) {
      console.error("Error al filtrar alumnos:", error);
    }
  };

  const manejarSeleccionAlumno = (id) => {
    setAlumnosSeleccionados((prevSeleccionados) =>
      prevSeleccionados.includes(id)
        ? prevSeleccionados.filter((alumnoId) => alumnoId !== id)
        : [...prevSeleccionados, id]
    );
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    const confirmacion = window.confirm("¿Estás seguro de enviar el mensaje?");
    if (!confirmacion) return;

    const payload = { asunto, contenido, destinatarios: alumnosSeleccionados };

    try {
      await axios.post('http://127.0.0.1:8000/api/v1/estudiantes/coordinador/enviar-mensaje/', payload, {
        headers: { Authorization: `Bearer ${authTokens.refresh}` },
      });
      setMensajeEnviado(true);
      setAsunto('');
      setContenido('');
      setAlumnosSeleccionados([]);
      setTimeout(() => setMensajeEnviado(false), 3000);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <div className="containerConfig">
      {mensajeEnviado && (
        <div className="alert alert-success text-center">
          ¡Mensaje enviado con éxito!
        </div>
      )}
      <form onSubmit={enviarMensaje}>
        <div className="form-group mb-3">
          <label htmlFor="asunto" className="form-label">Asunto</label>
          <input
            type="text"
            id="asunto"
            className="form-control"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            placeholder="Ingresa el asunto del mensaje"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="contenido" className="form-label">Contenido</label>
          <textarea
            id="contenido"
            className="form-control"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribe el contenido del mensaje"
            rows="4"
            required
          ></textarea>
        </div>
        <hr />
        <h5 className="mb-3">Seleccionar destinatarios</h5>
        {/* Botón para mostrar/ocultar filtros */}
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {mostrarFiltros && (
          <div className="filtros mb-4">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="filtros-anio" className="form-label">Compromiso de pago firmado</label>
                <select
                  id="filtros-anio"
                  className="form-select"
                  value={filtros.anio}
                  onChange={(e) => actualizarFiltros({ anio: e.target.value })}
                >
                  <option value="">Todos</option>
                  {['Si', 'No'].map((anio) => (
                    <option key={anio} value={anio}>{anio}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="filtros-materia" className="form-label">Materia</label>
                <select
                  id="filtros-materia"
                  className="form-select"
                  value={filtros.materia}
                  onChange={(e) => actualizarFiltros({ materia: e.target.value })}
                >
                  <option value="">Todas las Materias</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.nombre}>{materia.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="filtros-buscar" className="form-label">Buscar Alumnos</label>
              <input
                type="text"
                id="filtros-buscar"
                className="form-control"
                value={filtros.buscar}
                onChange={(e) => actualizarFiltros({ buscar: e.target.value })}
                placeholder="Buscar por nombre o apellido"
              />
            </div>
          </div>
        )}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="seleccionar-todos"
            className="form-check-input"
            checked={
              alumnosSeleccionados.length > 0 &&
              alumnosSeleccionados.length === alumnosFiltrados.length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setAlumnosSeleccionados(alumnosFiltrados.map((alumno) => alumno.id));
              } else {
                setAlumnosSeleccionados([]);
              }
            }}
          />
          <label htmlFor="seleccionar-todos" className="form-check-label">
            Seleccionar/Deseleccionar Todos
          </label>
        </div>
        <div className="alumnos-list mt-3">
          {alumnosFiltrados.map((alumno) => (
            <div key={alumno.id} className="form-check">
              <input
                type="checkbox"
                id={`alumno-${alumno.id}`}
                className="form-check-input"
                value={alumno.id}
                checked={alumnosSeleccionados.includes(alumno.id)}
                onChange={() => manejarSeleccionAlumno(alumno.id)}
              />
              <label htmlFor={`alumno-${alumno.id}`} className="form-check-label">
                {alumno.nombre} {alumno.apellido}
              </label>
            </div>
          ))}
        </div>
          <br />
            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={alumnosSeleccionados.length === 0}
              >
                Enviar Mensaje
              </button>
            </div>
      </form>
    </div>
  );
};

export default EnviarMensajeMultidestinatario;