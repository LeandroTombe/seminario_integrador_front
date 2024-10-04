import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HistorialPagos = ({ authTokens, alumno }) => {
    const [pagos, setPagos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPagos = async () => {
            let url = 'http://127.0.0.1:8000/api/v1/estudiantes/pagos/porAlumno/';
            let options = {
                headers: {
                    'Authorization': `Bearer ${authTokens.refresh}`, 
                },
            };

            if (alumno) {
                options.method = 'POST';
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ alumno: alumno.id }); 
            } else {
                options.method = 'GET';
            }

            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setPagos(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPagos();
    }, [authTokens, alumno]);


    return(
        <>
        {console.log(pagos)}
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Nro Recibo</th>
                    <th>Monto Pagado</th>
                    <th>Forma de Pago</th>
                    <th>Concepto de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map(pago => (
                    <tr key={pago.id}>
                        <td>{pago.numero_recibo}</td>
                        <td>{pago.monto_confirmado}</td>
                        <td>{pago.forma_pago}</td>
                        <td>
                            <>
                                {pago.detalles.map((detalle) => (
                                    <li key={detalle.id}>
                                        Cuota {detalle.cuota.nroCuota}: ${detalle.monto_cuota}
                                    </li>
                                ))}
                            </>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default HistorialPagos;