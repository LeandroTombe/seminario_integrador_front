import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CuotasActuales = (authTokens) => {
    const [cuotas, setCuotas] = useState([]);
    const [error, setError] = useState(null); // Para manejar posibles errores

    useEffect(() => {
        const fetchCuotas = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/estadoDeCuentaAlumno/', {
                    headers: {
                      'Authorization': `Bearer ${authTokens.authTokens.refresh}`, // Usar el token de acceso
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

    const getEstado = (cuota) => {
        const today = new Date();
        const fechaVencimiento = new Date(cuota.fechaPrimerVencimiento);

        // Verificar si la cuota está vencida
        if (today > fechaVencimiento && cuota.importePagado < cuota.total) {
            return 'Vencida';
        }

        // Comparar importe pagado con el total
        return cuota.importePagado >= cuota.total ? 'Pagado' : 'Pendiente';
    };

    // Función para formatear fechas a solo mes y día
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Ajustar la fecha para evitar el desfase de zona horaria
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        return adjustedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    };

    return (
        <>
            {error ? (
                <p>{error}</p>
            ) : cuotas.length === 0 ? (
                <p>No existen cuotas asignadas para este cuatrimestre</p>
            ) : (
                <Table striped bordered hover>
                    {console.log(cuotas)}
                    <thead>
                        <tr>
                            <th>Cuota</th>
                            <th>Año</th>
                            <th>Importe</th>
                            <th>Primer vencimiento</th>
                            <th>Segundo vencimiento</th>
                            <th>Mora aplicada</th>
                            <th>Total</th>
                            <th>Importe Pagado</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuotas.map(cuota => {
                            const estado = getEstado(cuota);
                            return (
                            <tr key={cuota.nroCuota} className={estado === 'Vencida' ? 'table-danger' : ''}>
                                <td>{cuota.nroCuota}</td>
                                <td>{cuota.año}</td>
                                <td>$ {cuota.importe}</td>
                                <td>{formatDate(cuota.fechaPrimerVencimiento)}</td>
                                <td>{formatDate(cuota.fechaSegundoVencimiento)}</td>
                                <td>$ {(parseFloat(cuota.moraSegundoVencimiento) + parseFloat(cuota.moraPrimerVencimiento)).toFixed(2)}</td>
                                <td>$ {cuota.total}</td>
                                <td>$ {cuota.importePagado}</td>
                                <td>{getEstado(cuota)}</td>
                            </tr>
                            )
                        }
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default CuotasActuales;