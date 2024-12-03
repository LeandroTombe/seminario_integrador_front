import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HistorialCuotas = (authTokens) => {

    return (
        <>
            { false ? (
                <p>No existen cuotas anteriores </p>    
            ) : (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Cuota</th>
                        <th>Año</th>
                        <th>Importe</th>
                        <th>Mora</th>
                        <th>Total</th>
                        <th>Importe Pagado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>3</td>
                        <td>2024</td>
                        <td>$ 20000.00</td>
                        <td>$ 00.00</td>
                        <td>$ 20000.00</td>
                        <td>$ 20000.00</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>2024</td>
                        <td>$ 20000.00</td>
                        <td>$ 00.00</td>
                        <td>$ 20000.00</td>
                        <td>$ 20000.00</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>2024</td>
                        <td>$ 20000.00</td>
                        <td>$ 00.00</td>
                        <td>$ 20000.00</td>
                        <td>$ 20000.00</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>2024</td>
                        <td>$ 20000.00</td>
                        <td>$ 00.00</td>
                        <td>$ 20000.00</td>
                        <td>$ 20000.00</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>2024</td>
                        <td>$ 20000.00</td>
                        <td>$ 00.00</td>
                        <td>$ 20000.00</td>
                        <td>$ 20000.00</td>
                    </tr>
                </tbody>
            </Table>
            )}
        </>
    );
}

export default HistorialCuotas