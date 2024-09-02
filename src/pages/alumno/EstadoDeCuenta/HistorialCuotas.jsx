import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CuotasActuales = (authTokens) => {

    return (
        <>
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
                                <tr>
                                    <td>3</td>
                                    <td>2024</td>
                                    <td>20000</td>
                                    <td>0</td>
                                    <td>20000</td>
                                    <td>2024-03-10</td>
                                    <td>20000</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>2024</td>
                                    <td>20000</td>
                                    <td>0</td>
                                    <td>20000</td>
                                    <td>2024-04-10</td>
                                    <td>20000</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>2024</td>
                                    <td>20000</td>
                                    <td>0</td>
                                    <td>20000</td>
                                    <td>2024-05-10</td>
                                    <td>20000</td>
                                </tr>
                        </tbody>
                    </Table>
        </>
    );
}

export default CuotasActuales