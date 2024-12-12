import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { Pagination } from 'react-bootstrap';
import './MensajesRecibidos.css'; // Archivo CSS actualizado para estilos

const MensajesEnviados = () => {
    const { authTokens, user } = useAuth();
    const [mensajes, setMensajes] = useState([]);
    const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1); // Página actual
    const mensajesPorPagina = 8; // Número de mensajes por página

    useEffect(() => {
        const fetchMensajes = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/mensajes/enviados', {
                headers: {
                    'Authorization': `Bearer ${authTokens.refresh}`,
                },
            });
            const data = await response.json();
            setMensajes(data);
        };

        fetchMensajes();
        const interval = setInterval(fetchMensajes, 60000); // Polling cada 1 min
        return () => clearInterval(interval);
    }, [authTokens]);

    const handleMensajeClick = (msg) => {
        setMensajeSeleccionado(msg);
    };

    const handleBackClick = () => {
        setMensajeSeleccionado(null);
    };

    // Lógica para calcular los mensajes que se deben mostrar en la página actual
    const indiceUltimoMensaje = paginaActual * mensajesPorPagina;
    const indicePrimerMensaje = indiceUltimoMensaje - mensajesPorPagina;
    const mensajesActuales = mensajes.slice(indicePrimerMensaje, indiceUltimoMensaje);

    // Cambiar página
    const paginate = (numeroPagina) => setPaginaActual(numeroPagina);

    // Determinar el número total de páginas
    const totalPaginas = Math.ceil(mensajes.length / mensajesPorPagina);

    // Estado para controlar si la lista de destinatarios es visible o no
    const [isDestinatariosVisible, setIsDestinatariosVisible] = useState(false);

    // Función para alternar la visibilidad de los destinatarios
    const toggleDestinatariosVisibility = () => {
        setIsDestinatariosVisible(!isDestinatariosVisible);
    };

    return (
        <div className="mensajes-container">
            {mensajeSeleccionado ? (
                <div className="mensaje-detalle">
                    <button onClick={handleBackClick} className="back-button">← Volver a Mensajes Enviados</button>
                    <h3>{mensajeSeleccionado.asunto}</h3>
                    <p>{mensajeSeleccionado.contenido}</p>
                    <span>Enviado: {new Date(mensajeSeleccionado.fecha_envio).toLocaleDateString()}, {new Date(mensajeSeleccionado.fecha_envio).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {user.role == "Coordinador" &&
                    <>
                        <p>
                            <button onClick={toggleDestinatariosVisibility}>
                                {isDestinatariosVisible ? 'Ocultar Destinatarios' : 'Ver Destinatarios'}
                            </button>
                        </p>

                        {isDestinatariosVisible && (
                            <>
                            <h2>Destinatarios</h2>
                                <div className="alumnos-list">
                                    {mensajeSeleccionado.destinatario.map((dest, index) => (
                                        <p key={index}>{dest.apellido}, {dest.nombre} - {dest.legajo}</p>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                    }

                </div>
            ) : (
                <div className="mensaje-lista">
                    {mensajesActuales.length === 0 ? (
                        <p>No tienes mensajes enviados</p>
                    ) : (
                    <>
                        <div className="mensaje-header">
                            <div className="mensaje-titulo">Asunto</div>
                            <div className="mensaje-contenido">Contenido</div>
                            <div className="mensaje-fecha">Enviado</div>
                        </div>
                        {mensajesActuales.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => handleMensajeClick(msg)}
                                className="mensaje-item read"
                            >
                                <h3 className="mensaje-titulo">
                                    {msg.asunto.length > 30
                                        ? `${msg.asunto.substring(0, 30)}...`
                                        : msg.asunto}
                                </h3>
                                <p className="mensaje-contenido">
                                    {msg.contenido.length > 100
                                        ? `${msg.contenido.substring(0, 100)}...`
                                        : msg.contenido}
                                </p>
                                <span className="mensaje-fecha">
                                    {new Date(msg.fecha_envio).toLocaleDateString()}, {new Date(msg.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        </>
                    )}
                    {/* Componente de paginación de React-Bootstrap */}
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

export default MensajesEnviados;