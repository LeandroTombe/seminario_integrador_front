import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from "react-bootstrap";
import Layout from '../../../Layout';
import EnviarMensaje from './EnviarMensaje'
import MensajesRecibidos from "./MensajesRecibidos";
import MensajesEnviados from "./MensajesEnviados";
import { useAuth } from "../../../context/AuthContext";

function Mensajes() {
    const [cantidadMensajesNoLeidos, setCantidadMensajesNoLeidos] = useState(0);
    const { authTokens } = useAuth();
  
    const actualizarCantidadMensajesNoLeidos = (cantidad) => {
      setCantidadMensajesNoLeidos(cantidad);
    };
  
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
    }, []);

    return (
        <Layout>
            <h1>Mensajes</h1>
            <Tabs defaultActiveKey="pantalla1" id="mensajes-tabs" className="mb-3">
                <Tab eventKey="pantalla1" title={`Mensajes Recibidos ${cantidadMensajesNoLeidos > 0 ? `(${cantidadMensajesNoLeidos})` : ''}`} mountOnEnter unmountOnExit>
                    <MensajesRecibidos actualizarCantidadMensajesNoLeidos={actualizarCantidadMensajesNoLeidos} />
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