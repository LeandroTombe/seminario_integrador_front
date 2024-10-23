// Componente CompromisoDePago
import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CargarCompromiso from './CargarCompromiso';
import Compromiso from './Compromiso';
import HistorialCompromisos from './HistorialCompromiso';
import Layout from '../../../Layout';

const CompromisoDePago = () => {
    const [activeTab, setActiveTab] = useState('actual'); // Controla la tab activa

    return (
        <Layout>
            <h1>Compromiso de Pago</h1>
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)} // Cambia la tab activa
                id="compromiso-de-pago-tabs"
                className="mb-3"
            >
                <Tab eventKey="actual" title="Valores y Compromiso de Pago Actual">
                    {activeTab === 'actual' && <Compromiso setActiveTab={setActiveTab} />}
                </Tab>
                <Tab eventKey="nuevo" title="Nuevos Valores y Compromiso de Pago">
                    {activeTab === 'nuevo' && <CargarCompromiso setActiveTab={setActiveTab}/>}
                </Tab>
                <Tab eventKey="historial" title="Historial de Valores y Compromiso de Pago">
                    {activeTab === 'historial' && <HistorialCompromisos />}
                </Tab>
            </Tabs>
        </Layout>
    );
};

export default CompromisoDePago;