import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import Layout from '../../Layout';

// Asegúrate de importar el archivo CSS de Bootstrap en tu archivo principal, por ejemplo, en index.js o App.js
import 'bootstrap/dist/css/bootstrap.min.css';

const AlumnosFirmasCompromiso = () => {
    const [firmantes, setFirmantes] = useState([]);

    useEffect(() => {
        const fetchFirmantes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/listadoFirmaCompromisoActual/'); // Asegúrate de que esta ruta coincida con la de tu backend
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setFirmantes(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFirmantes();
    }, []);

    return (
        <Layout>
            {console.log(firmantes)}
            <h1>Firmantes del Compromiso Actual</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Legajo</th>
                        <th>Nombre</th>
                        <th>Fecha de Firma</th>
                        {/* Agrega más columnas si es necesario */}
                    </tr>
                </thead>
                <tbody>
                    {firmantes.map(firmante => (
                        <tr key={firmante.id}>
                            <td>{firmante.alumno.legajo}</td>
                            <td>{firmante.alumno.nombre}</td>
                            <td>{firmante.fechaFirma}</td>
                            {/* Agrega más celdas si es necesario */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Layout>
    );
};

export default AlumnosFirmasCompromiso;