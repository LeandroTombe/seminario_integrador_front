import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CuotasActuales = (authTokens) => {

    return (
        <>
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
                        </tbody>
                    </Table>
        </>
    );
}

export default CuotasActuales