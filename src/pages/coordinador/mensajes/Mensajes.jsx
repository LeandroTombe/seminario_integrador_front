import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from "react-bootstrap";
import Layout from '../../../Layout';
import EnviarMensaje from './EnviarMensaje'
import MensajesRecibidos from "./MensajesRecibidos";
import MensajesEnviados from "./MensajesEnviados";
import { useMensajes } from "../../../context/MensajesContext";

function Mensajes() {
    const {cantidadMensajesNoLeidos} = useMensajes();


    return (
        <Layout>
            <h1>Mensajes</h1>
            <Tabs defaultActiveKey="pantalla1" id="mensajes-tabs" className="mb-3">
                <Tab eventKey="pantalla1" title={`Mensajes Recibidos ${cantidadMensajesNoLeidos > 0 ? `(${cantidadMensajesNoLeidos})` : ''}`} mountOnEnter unmountOnExit>
                    <MensajesRecibidos />
                </Tab>
                <Tab eventKey="reporte2" title="Mensajes Enviados" mountOnEnter unmountOnExit>
                    <MensajesEnviados />
                </Tab>
                <Tab eventKey="reporte3" title="Enviar mensaje" mountOnEnter unmountOnExit>
                    <EnviarMensaje />
                </Tab>
            </Tabs>
        </Layout>
    );
}

export default Mensajes;