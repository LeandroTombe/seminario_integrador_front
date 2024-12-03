import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { useMensajes } from "../../../context/MensajesContext"; // Usar el contexto
import { Pagination } from 'react-bootstrap';
import './MensajesRecibidos.css';

const MensajesRecibidos = ({ actualizarCantidadMensajesNoLeidos }) => {
  const { authTokens, user } = useAuth();
  const { cantidadMensajesNoLeidos, marcarMensajeComoLeido } = useMensajes();
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const mensajesPorPagina = 4;

  useEffect(() => {
    const fetchMensajes = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/mensajes/', {
        headers: {
          'Authorization': `Bearer ${authTokens.refresh}`,
        },
      });
      const data = await response.json();
      setMensajes(data);
      actualizarCantidadMensajesNoLeidos(data.filter(msg => !msg.leido_por || !msg.leido_por.includes(user.user_id)).length);
    };

    fetchMensajes();
    const interval = setInterval(fetchMensajes, 60000); // Polling cada 1 min
    return () => clearInterval(interval);
  }, [authTokens, user.user_id, actualizarCantidadMensajesNoLeidos]);

  const marcarComoLeido = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/v1/estudiantes/mensajes/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${authTokens.refresh}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visto: true }),
    });

    setMensajes((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, visto: true } : msg))
    );

    // Actualizamos la cantidad de mensajes no leídos
    marcarMensajeComoLeido();
    actualizarCantidadMensajesNoLeidos(mensajes.filter(msg => !msg.leido_por || !msg.leido_por.includes(user.user_id)).length - 1);
  };

  const handleMensajeClick = (msg) => {
    if (!msg.leido_por.includes(user.user_id)){
        console.log(msg.leido_por.includes(user.user_id))
        marcarComoLeido(msg.id);
    }
    
    setMensajeSeleccionado(msg);
  };

  const handleBackClick = () => {
    setMensajeSeleccionado(null);
  };

  // Lógica de paginación
  const indiceUltimoMensaje = paginaActual * mensajesPorPagina;
  const indicePrimerMensaje = indiceUltimoMensaje - mensajesPorPagina;
  const mensajesActuales = mensajes.slice(indicePrimerMensaje, indiceUltimoMensaje);

  const paginate = (numeroPagina) => setPaginaActual(numeroPagina);

  const totalPaginas = Math.ceil(mensajes.length / mensajesPorPagina);

  return (
    <div className="mensajes-container">
      {mensajeSeleccionado ? (
        <div className="mensaje-detalle">
          <button onClick={handleBackClick} className="back-button">← Volver a Mensajes Recibidos</button>
          <h3>{mensajeSeleccionado.asunto}</h3>
          <p>{mensajeSeleccionado.contenido}</p>
          <span>Recibido: {new Date(mensajeSeleccionado.fecha_envio).toLocaleDateString()}, {new Date(mensajeSeleccionado.fecha_envio).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ) : (
        <div className="mensaje-lista">
          {mensajesActuales.length === 0 ? (
            <p>No tienes mensajes recibidos</p>
          ) : (
            mensajesActuales.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleMensajeClick(msg)}
                className={`mensaje-item ${msg.leido_por && msg.leido_por.includes(user.user_id) ? 'read' : 'unread'}`}
              >
                <h3 className="mensaje-titulo">{msg.remitente.apellido} {msg.remitente.nombre}</h3>
                <p className="mensaje-contenido">
                  {msg.asunto.length > 100 ? `${msg.asunto.substring(0, 100)}...` : msg.asunto}
                </p>
                <span className="mensaje-fecha">
                  {new Date(msg.fecha_envio).toLocaleDateString()}, {new Date(msg.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}

          <Pagination className="pagination-container">
            <Pagination.Prev
              onClick={() => setPaginaActual(paginaActual - 1)}
              disabled={paginaActual === 1}
            />
            {Array.from({ length: totalPaginas }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === paginaActual}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MensajesRecibidos;