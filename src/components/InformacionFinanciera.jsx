import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const InformacionFinanciera = ({ pagos }) => {
    const [showModal, setShowModal] = useState(false);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [cuatrimestre, setCuatrimestre] = useState(
        new Date().getMonth() + 1 <= 7 ? 1 : 2
    );

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const mesesCuatrimestre = cuatrimestre === 1
        ? ["marzo", "abril", "mayo", "junio", "julio"]
        : ["agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    const pagosFiltrados = pagos.filter(pago => {
        const fecha = new Date(pago.fecha_pago_confirmado);
        const mes = fecha.getMonth() + 1;
        const anioPago = fecha.getFullYear();

        const enCuatrimestre = cuatrimestre === 1
            ? mes >= 3 && mes <= 7
            : mes >= 8 && mes <= 12;

        return anioPago === anio && enCuatrimestre;
    });

    const datosTabla = mesesCuatrimestre.map(mes => {
        const recaudado = pagosFiltrados
            .filter(pago => new Date(pago.fecha_pago_confirmado).toLocaleString("es-ES", { month: "long" }) === mes)
            .reduce((total, pago) => total + parseFloat(pago.monto_confirmado), 0);

        return { mes, recaudado };
    });

    // Calcular el total recaudado
    const totalRecaudado = datosTabla.reduce((sum, item) => sum + item.recaudado, 0);

    const formatNumber = (number) => {
        return new Intl.NumberFormat('es-AR', { style: 'decimal' }).format(number);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Resúmen financiero
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Resúmen financiero</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <div className="d-flex align-items-center mb-3">
                        <Form.Label htmlFor="anioSeleccionado" className="me-3">
                            Año
                        </Form.Label>
                        <Form.Control
                            as="select"
                            id="anioSeleccionado"
                            value={anio}
                            onChange={(e) => setAnio(parseInt(e.target.value))}
                            className="flex-grow-1"
                        >
                            <option value={2022}>2022</option>
                            <option value={2023}>2023</option>
                            <option value={2024}>2024</option>
                        </Form.Control>
                    </div>

                    <div className="d-flex align-items-center">
                        <Form.Label htmlFor="cuatrimestreSeleccionado" className="me-3">
                            Cuatrimestre
                        </Form.Label>
                        <Form.Control
                            as="select"
                            id="cuatrimestreSeleccionado"
                            value={cuatrimestre}
                            onChange={(e) => setCuatrimestre(parseInt(e.target.value))}
                            className="flex-grow-1"
                        >
                            <option value={1}>1er Cuatrimestre</option>
                            <option value={2}>2do Cuatrimestre</option>
                        </Form.Control>
                    </div>
                </Form>

                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Mes</th>
                                <th>Recaudado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosTabla.map(({ mes, recaudado }, index) => (
                                <tr key={index}>
                                    <td>{mes.charAt(0).toUpperCase() + mes.slice(1)}</td>
                                    <td>${formatNumber(recaudado.toFixed(2))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h5 className="text-end mt-3">
                        Total Recaudado: <strong>$ {formatNumber(totalRecaudado.toFixed(2))}</strong>
                    </h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default InformacionFinanciera;