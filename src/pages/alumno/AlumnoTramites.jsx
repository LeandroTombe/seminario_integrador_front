import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Layout from '../../LayoutAlumno';
import Prorroga from './Tramites/Prorroga';

function AlumnoTramites() {

      return (
          <Layout>
              <h1>Trámites</h1>
              <Tabs defaultActiveKey="prorroga" id="tramites-tabs" className="mb-3">
                  <Tab eventKey="prorroga" title="Solicitud de Prórroga de Regularización" mountOnEnter unmountOnExit>
                      <Prorroga />
                  </Tab>
                  <Tab eventKey="baja" title="Baja Provisoria" mountOnEnter unmountOnExit>
                      <Prorroga />
                  </Tab>
              </Tabs>
          </Layout>
      );
  }
  

  export default AlumnoTramites;