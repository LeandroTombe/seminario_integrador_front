import React, { useState, useEffect } from 'react';
import Layout from "../../LayoutAlumno";
import { Tabs, Tab } from "react-bootstrap";
import BaseNotificacion from "../notificacion/BaseNotificacion";
import MensajesEnviados from "../coordinador/mensajes/MensajesEnviados";
import MensajesRecibidos from "../coordinador/mensajes/MensajesRecibidos";
import EnviarMensajeAlumno from "./EnviarMensajeAlumno";
import { useAuth } from "../../context/AuthContext" 

function AlumnoMensajes() {
  const [cantidadMensajesNoLeidos, setCantidadMensajesNoLeidos] = useState(0);
  const [cantidadNotificacionesNoVistas, setCantidadNotificacionesNoVistas] = useState(0);
  const { authTokens } = useAuth();

  const actualizarCantidadMensajesNoLeidos = (cantidad) => {
    setCantidadMensajesNoLeidos(cantidad);
  };

  const actualizarNotificacionesNoVistas = (cantidad) => {
    setCantidadNotificacionesNoVistas(cantidad)
  }

  useEffect(() => {
    // Llamada al endpoint para obtener la cantidad de mensajes no leídos
    const fetchCantidadMensajesNoLeidos = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/mensajes/no_leidos/', {
        headers: {
          'Authorization': `Bearer ${authTokens.refresh}`,
        },
      });

      const data = await response.json();
      setCantidadMensajesNoLeidos(data.cantidad_no_leidos);
    };

    fetchCantidadMensajesNoLeidos();
    const interval = setInterval(fetchCantidadMensajesNoLeidos, 60000); // Polling cada 1 min
    return () => clearInterval(interval);
  }, [authTokens]);

  // Fetch para obtener notificaciones no vistas si el usuario es un alumno
  useEffect(() => {
    const fetchNotificacionesNoVistas = async () => {

        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/notificaciones/', {
          headers: {
            'Authorization': `Bearer ${authTokens.refresh}`,
          },
        });

        const data = await response.json();
        setCantidadNotificacionesNoVistas(data.filter((notif) => !notif.visto).length);
    };

    fetchNotificacionesNoVistas();
    const interval = setInterval(fetchNotificacionesNoVistas, 60000); // Polling cada minuto
    return () => clearInterval(interval);
  }, [authTokens]);

  return (
    <Layout>
      <h1>Mensajes</h1>
      <Tabs defaultActiveKey="pantalla1" id="mensajes-tabs" className="mb-3">
        <Tab
          eventKey="pantalla1"
          title={`Mensajes Recibidos ${cantidadMensajesNoLeidos > 0 ? `(${cantidadMensajesNoLeidos})` : ''}`}
          mountOnEnter
          unmountOnExit
        >
          <MensajesRecibidos actualizarCantidadMensajesNoLeidos={actualizarCantidadMensajesNoLeidos} />
        </Tab>
        <Tab eventKey="pantalla2" title="Mensajes Enviados" mountOnEnter unmountOnExit>
          <MensajesEnviados />
        </Tab>
        <Tab eventKey="pantalla3" title={`Notificaciones ${cantidadNotificacionesNoVistas > 0 ? `(${cantidadNotificacionesNoVistas})` : ''}`} mountOnEnter unmountOnExit>
          <BaseNotificacion actualizarNotificacionesNoVistas={actualizarNotificacionesNoVistas} />
        </Tab>
        <Tab eventKey="pantalla4" title="Enviar mensaje" mountOnEnter unmountOnExit>
          <EnviarMensajeAlumno />
        </Tab>
      </Tabs>
    </Layout>
  );
}

export default AlumnoMensajes;