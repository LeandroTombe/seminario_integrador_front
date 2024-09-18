import React from 'react';
import { useLocation } from 'react-router-dom'; // Importa useLocation para acceder al estado
import Layout from '../../LayoutAlumno';
import EstadoDeCuenta from "./EstadoDeCuenta";
import ResumenAlumno from "./ResumenAlumno";

function AlumnoInicio() {
  const location = useLocation(); // Obtén la ubicación actual
  const successMessage = location.state?.successMessage; // Accede al mensaje de éxito si está presente

  return (
    <Layout>
      <div className="contenedor-principal">
        <h1>Inicio</h1>
        
        {successMessage && ( // Si hay un mensaje de éxito, muéstralo
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <ResumenAlumno />
        <EstadoDeCuenta />
      </div>
    </Layout>
  );
}

export default AlumnoInicio;