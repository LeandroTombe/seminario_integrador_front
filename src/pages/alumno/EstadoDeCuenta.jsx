import React, { useEffect, useState } from 'react';
import { Table, Container, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import CuotasActuales from '../alumno/EstadoDeCuenta/CuotasActuales'
import HistorialCuotas from '../alumno/EstadoDeCuenta/HistorialCuotas'
import HistorialPagos from '../alumno/EstadoDeCuenta/HistorialPagos'

const EstadoDeCuenta = ({alumno}) => {
    const { authTokens } = useAuth(); // Acceder a la información del usuario y tokens

    const obtenerFechaActual = () => {
        const hoy = new Date();
        const dia = hoy.getDate().toString().padStart(2, '0'); // Agrega un 0 si el día es menor de 10
        const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Los meses son de 0 a 11, por eso sumamos 1
        const año = hoy.getFullYear();
    
        return `${dia}/${mes}/${año}`; // Formato DD/MM/YYYY
    };

    return (
        <>
            <h2>Estado de cuenta al {obtenerFechaActual()}</h2>
            <Tabs defaultActiveKey="actuales" id="estado-de-cuenta-tabs" className="mb-3">
                <Tab eventKey="actuales" title="Cuotas del Cuatrimestre Actual">
                    <CuotasActuales authTokens={authTokens} alumno={alumno}/>
                </Tab>
                <Tab eventKey="pagadas" title="Historial de Cuotas">
                    <HistorialCuotas authTokens={authTokens} alumno={alumno}/>
                </Tab>
                <Tab eventKey="pagos" title="Historial de Pagos">
                    <HistorialPagos authTokens={authTokens} alumno={alumno}/>
                </Tab>
            </Tabs>
        </>
    );
};

export default EstadoDeCuenta;