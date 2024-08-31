import React, { useEffect, useState } from 'react';
import { Table, Container, Tabs, Tab } from 'react-bootstrap';
import Layout from '../../LayoutAlumno';
import { useAuth } from "../../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import CuotasActuales from '../alumno/EstadoDeCuenta/CuotasActuales'
import HistorialCuotas from '../alumno/EstadoDeCuenta/HistorialCuotas'

const EstadoDeCuenta = () => {
    const { authTokens } = useAuth(); // Acceder a la información del usuario y tokens
    
    return (
        <>
            <h2>Estado de cuenta</h2>
            <Tabs defaultActiveKey="actuales" id="estado-de-cuenta-tabs" className="mb-3">
                <Tab eventKey="actuales" title="Cuotas Activas">
                    <CuotasActuales authTokens={authTokens}/>
                </Tab>
                <Tab eventKey="pagadas" title="Historial de Cuotas">
                    <HistorialCuotas authTokens={authTokens}/>
                </Tab>
                <Tab eventKey="todas" title="Historial de Pagos">
                    
                </Tab>
            </Tabs>
        </>
    );
};

export default EstadoDeCuenta;