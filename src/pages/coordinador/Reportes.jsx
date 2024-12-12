import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Layout from '../../Layout';
import AlumnosCuatrimestre from './AlumnosCuatrimestre';
import ListadoPagos from './ListadoPagos';
import GestionHabilitacionAlumno from "./habilitacionAlumno/GestionHabilitacionAlumno";
import GestionProrroga from "./GestionProrroga"
import GestionBajaProvisoria from "./GestionBajaProvisoria"

function Reportes() {
    return (
        <Layout>
            <h1>Reportes</h1>
            <Tabs defaultActiveKey="reporte1" id="reportes-tabs" className="mb-3">
                <Tab eventKey="reporte1" title="Historial de Pagos" mountOnEnter unmountOnExit>
                    <ListadoPagos />
                </Tab>
                <Tab eventKey="reporte2" title="Gestión de inhabilitaciones" mountOnEnter unmountOnExit>
                    <GestionHabilitacionAlumno />
                </Tab>
                <Tab eventKey="reporte3" title="Prórrogas de Regularización" mountOnEnter unmountOnExit>
                    <GestionProrroga />
                </Tab>
                <Tab eventKey="reporte4" title="Bajas Provisorias" mountOnEnter unmountOnExit>
                    <GestionBajaProvisoria/>
                </Tab>
            </Tabs>
        </Layout>
    );
}

export default Reportes;