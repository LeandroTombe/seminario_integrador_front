import React, { useState, useEffect } from 'react';
import Layout from "../../LayoutAlumno";
import { Tabs, Tab } from "react-bootstrap";
import BaseNotificacion from "../notificacion/BaseNotificacion";
import MensajesEnviados from "../coordinador/mensajes/MensajesEnviados";
import MensajesRecibidos from "../coordinador/mensajes/MensajesRecibidos";
import EnviarMensajeAlumno from "./EnviarMensajeAlumno";
import { useMensajes } from "../../context/MensajesContext" 

function AlumnoMensajes() {
  const {cantidadMensajesNoLeidos, cantidadNotificacionesNoVistas} = useMensajes();


  return (
    <Layout>
      <h1>Mensajes</h1>
        <Tabs defaultActiveKey="pantalla1" id="mensajes-tabs" className="mb-3">
          <Tab eventKey="pantalla1" title={`Notificaciones ${cantidadNotificacionesNoVistas > 0 ? `(${cantidadNotificacionesNoVistas})` : ''}`} mountOnEnter unmountOnExit>
            <BaseNotificacion />
          </Tab>
          <Tab
            eventKey="pantalla2"
            title={`Mensajes Recibidos ${cantidadMensajesNoLeidos > 0 ? `(${cantidadMensajesNoLeidos})` : ''}`}
            mountOnEnter
            unmountOnExit
          >
            <MensajesRecibidos />
          </Tab>
          <Tab eventKey="pantalla3" title="Mensajes Enviados" mountOnEnter unmountOnExit>
            <MensajesEnviados />
          </Tab>
          <Tab eventKey="pantalla4" title="Enviar mensaje" mountOnEnter unmountOnExit>
            <EnviarMensajeAlumno />
          </Tab>
        </Tabs>
    </Layout>
  );
}

export default AlumnoMensajes;