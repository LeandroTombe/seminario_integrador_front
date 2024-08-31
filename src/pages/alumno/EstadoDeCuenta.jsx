import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import Layout from '../../LayoutAlumno';
import { useAuth } from "../../context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const EstadoDeCuenta = () => {
    const { authTokens } = useAuth(); // Acceder a la información del usuario y tokens
    const [cuotas, setCuotas] = useState([]);
    const [error, setError] = useState(null); // Para manejar posibles errores

    useEffect(() => {
        const fetchCuotas = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/estadoDeCuentaAlumno/', {
                    headers: {
                      'Authorization': `Bearer ${authTokens.refresh}`, // Usar el token de acceso
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setCuotas(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCuotas();
    }, [authTokens]);

    return (
        <>
        <h2>Estado de cuenta</h2>
                {error ? (
                    <p>{error}</p>
                ) : cuotas.length === 0 ? (
                    <p>No existen cuotas asignadas para este cuatrimestre</p>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Numero de Cuota</th>
                                <th>Año</th>
                                <th>Importe</th>
                                <th>Mora</th>
                                <th>Total</th>
                                <th>Vencimiento</th>
                                <th>Importe Pagado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuotas.map(cuota => (
                                <tr key={cuota.nroCuota}>
                                    <td>{cuota.nroCuota}</td>
                                    <td>{cuota.año}</td>
                                    <td>{cuota.importe}</td>
                                    <td>{cuota.mora}</td>
                                    <td>{cuota.total}</td>
                                    <td>{cuota.fechaVencimiento}</td>
                                    <td>{cuota.importePagado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </>
    );
};

export default EstadoDeCuenta;