import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CuotasActuales = ({ authTokens, alumno }) => {
    const [cuotas, setCuotas] = useState([]);
    const [error, setError] = useState(null); // Para manejar posibles errores

    useEffect(() => {
        const fetchCuotas = async () => {
            let url = 'http://127.0.0.1:8000/api/v1/estudiantes/estadoDeCuentaAlumno/';
            let options = {
                headers: {
                    'Authorization': `Bearer ${authTokens.refresh}`, // Usar el token de acceso
                },
            };

            if (alumno) {
                // Si hay un alumno, hacer una solicitud POST
                options.method = 'POST';
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ alumno: alumno.id }); // Enviar el ID del alumno
            } else {
                // Si no hay alumno, hacer una solicitud GET
                options.method = 'GET';
            }

            try {
                const response = await fetch(url, options);
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
    }, [authTokens, alumno]); // Dependencias de useEffect

    const getEstado = (cuota) => {
        const today = new Date();
        const fechaVencimiento = new Date(cuota.fechaPrimerVencimiento);
    
        // Calcular el último día del mes de la fecha de vencimiento
        const ultimoDiaMes = new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() + 1, 0);
    
        // Si la fecha actual es mayor o igual al primer día del mes siguiente y la cuota no está pagada
        if (today >= new Date(ultimoDiaMes.getFullYear(), ultimoDiaMes.getMonth() + 1, 1) && cuota.importePagado < cuota.total) {
            return 'Vencida';
        }
    
        // Comparar importe pagado con el total
        return cuota.importePagado >= cuota.total ? 'Pagado' : 'Pendiente';
    };

    // Función para formatear fechas a solo mes y día
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
    
        const dia = date.getUTCDate().toString().padStart(2, '0');
        const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son de 0 a 11, por eso sumamos 1
        const año = date.getUTCFullYear();
    
        return `${dia}/${mes}/${año}`; // Retorna en formato dd/mm/yyyy
    };

    return (
        <>
            {error ? (
                <p>{error}</p>
            ) : cuotas.length === 0 ? (
                <p>No tienes cuotas correspondientes al cuatrimestre actual.</p>
            ) : (
                <Table bordered hover>
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
                            <tr key={cuota.nroCuota} className={estado === 'Vencida' ? 'table-danger' : estado=== 'Pagado' ? 'table-success' :''}>
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