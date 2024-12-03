import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../coordinador/mensajes/EnviarMensaje.css';
import { useAuth } from "../../context/AuthContext";

const EnviarMensajeAlumno = () => {
  const { authTokens } = useAuth();
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const [destinatarios, setDestinatarios] = useState('');
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const enviarMensaje = async (e) => {
    e.preventDefault();

    // Mostrar un alert para confirmar la acción
    const confirmacion = window.confirm(
      "¿Estás seguro de enviar el mensaje?"
    );

    // Si el usuario cancela, no se envía el mensaje
    if (!confirmacion) {
      return;
    }

    const payload = {
      asunto,
      contenido,
      destinatarios
    };

    try {
        await axios.post(
            'http://127.0.0.1:8000/api/v1/estudiantes/coordinador/enviar-mensaje/',
            payload,
            {
              headers: {
                Authorization: `Bearer ${authTokens.refresh}`,
              },
            }
          );
      setMensajeEnviado(true);
      setAsunto('');
      setContenido('');
      setAlumnosSeleccionados('');
      setTimeout(() => setMensajeEnviado(false), 3000);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  return (
    <>
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

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      
    </>
  );
};

export default EnviarMensajeAlumno;