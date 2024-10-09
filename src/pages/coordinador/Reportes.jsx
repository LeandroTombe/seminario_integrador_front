import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Layout from '../../Layout';
import AlumnosCuatrimestre from './AlumnosCuatrimestre';
import ListadoPagos from './ListadoPagos';
import GestionHabilitacionAlumno from "./habilitacionAlumno/GestionHabilitacionAlumno";

function Reportes() {
    return (
        <Layout>
            <h1>Reportes</h1>
            <Tabs defaultActiveKey="reporte1" id="reportes-tabs" className="mb-3">
                <Tab eventKey="reporte1" title="Alumnos cursantes del cuatrimestre actual" mountOnEnter unmountOnExit>
                    <AlumnosCuatrimestre />
                </Tab>
                <Tab eventKey="reporte2" title="Historial de Pagos" mountOnEnter unmountOnExit>
                    <ListadoPagos />
                </Tab>
                <Tab eventKey="reporte3" title="Gestión de inhabilitaciones" mountOnEnter unmountOnExit>
                    <GestionHabilitacionAlumno />
                </Tab>
            </Tabs>
        </Layout>
    );
}

export default Reportes;