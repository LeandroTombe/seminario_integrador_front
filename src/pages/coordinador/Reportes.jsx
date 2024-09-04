import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Sidebar from "./SidebarCoordinador";
import Layout from '../../Layout';
import FirmantesCompromiso from './AlumnosFirmasCompromiso'
import AlumnosCuatrimestre from './AlumnosCuatrimestre'

function Reportes() {
    return (
        <Layout>
            <h1>Reportes</h1>
            <Tabs defaultActiveKey="reporte1" id="reportes-tabs" className="mb-3">
                <Tab eventKey="reporte1" title="Alumnos Inscriptos">
                    <AlumnosCuatrimestre/>
                </Tab>
                <Tab eventKey="reporte2" title="Firmantes Compromiso de Pago">
                    <FirmantesCompromiso/>
                </Tab>
            </Tabs>
        </Layout>
    );
}

export default Reportes;
  