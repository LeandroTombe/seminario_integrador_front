import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AlumnoPago = () => {
  const [alumno, setAlumno] = useState(null);
  const { authTokens } = useAuth(); // Importa el contexto de autenticación

  useEffect(() => {

    // Hacemos la petición al endpoint que devuelve el perfil del alumno autenticado
    fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/perfil/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.refresh}` // Pasamos el token de acceso
      }
    })
      .then(response => response.json())
      .then(data => setAlumno(data))
      .catch(error => console.error('Error al obtener los datos del alumno:', error));
  }, [authTokens.refresh]); // El token de acceso es la dependencia

  function fecha() {
    const date = new Date();
  
    const day = String(date.getDate()).padStart(2, '0'); // día
    const month = String(date.getMonth() + 1).padStart(2, '0'); //  mes
    const year = String(date.getFullYear()) // año
  
    return `${year}-${month}-${day}`;
  }

  const fechaHoy = fecha();

  if (!alumno) {
    return <div>Cargando...</div>;
  }
  // Genera la URL pre-rellena del formulario de Google Forms
  const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSd2MWAkLz3BYEFIzFJDy9up1lGKuNACe1oOKLZ4p7Jhs-osVA/viewform?usp=pp_url&entry.1981210019=${alumno.apellido},+${alumno.nombre}&entry.246393120=Tecnicatura+Universitaria+en+Programaci%C3%B3n&entry.528240021=${alumno.dni}&entry.1687154301=${fechaHoy}`;

  return (
    <div>
      <h3>Formulario de Pago</h3>
      <a href={googleFormUrl} target="_blank" rel="noopener noreferrer">
        Completar el formulario de pago
      </a>
    </div>
  );
};

export default AlumnoPago;