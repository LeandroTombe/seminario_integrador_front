import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import NuevaBajaProvisoria from './NuevaBajaProvisoria';

const BajaProvisoria = () => {
    const { authTokens } = useAuth();
    const [bajas, setBajas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBaja, setSelectedBaja] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [compromiso, setCompromiso] = useState([]);

    useEffect(() => {
      const fetchCompromiso = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/compromisoActual/');
          const compromiso = await response.json();
          if (!response.ok) {
            throw new Error(response.error);
          }
          setCompromiso(compromiso);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchCompromiso();
    }, [authTokens]);

    // Obtener el historial de bajas provisorias
    const fetchBajas = () => {
        fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/tramites/listado-baja-alumno/', {
            headers: { Authorization: `Bearer ${authTokens.refresh}` },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al obtener el historial de bajas provisorias.');
                }
            })
            .then((data) => setBajas(data))
            .catch((error) => setError(error.message));
    };

    useEffect(() => {
        fetchBajas();
    }, [authTokens]);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBaja(null);
    };

    const handleShowModal = (baja) => {
        setSelectedBaja(baja);
        setShowModal(true);
    };

    const handleSuccess = (message) => {
        setMessage(message);
        handleCloseModal();
        fetchBajas(); // Actualizar el historial
    };

    return (
        <>
            <h2>Historial de Bajas Provisorias</h2>
            
            {bajas.length === 0 ? (
                <p>No existen solicitudes de bajas provisorias anteriores</p>
            ) : (
                <Table bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Periodo Solicitado</th>
                            <th>Fecha Solicitud</th>
                            <th>Estado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bajas.map((baja) => (
                            <tr
                                key={baja.id}
                                className={
                                    baja.estado === 'Rechazada'
                                    ? 'table-danger'
                                    : baja.estado === 'Aprobada'
                                    ? 'table-success'
                                    : ''
                                }
                            >
                                <td>Año {baja.compromiso.año} Cuatrimestre {baja.compromiso.cuatrimestre}</td>
                                <td>{new Date(baja.fecha_solicitud).toLocaleDateString()}</td>
                                <td>{baja.estado}</td>
                                <td>
                                    <span
                                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={() => handleShowModal(baja)}
                                    >
                                        Ver Detalle
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Button variant="primary" onClick={() => setShowModal(true)}>
                Solicitar Baja Provisoria
            </Button>
            <br /><br />
            {message && <Alert variant="success">{message}</Alert>}

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBaja ? "Detalle de Baja Provisoria" : "Solicitar Baja Provisoria"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBaja ? (
                        <div className="p-3 mb-4">

                            <Row className="mb-3">
                                <Col md={6}><strong>Fecha de Solicitud:</strong> {new Date(selectedBaja.fecha_solicitud).toLocaleDateString()}</Col>
                                <Col md={6}><strong>Estado:</strong> {selectedBaja.estado}</Col>
                            </Row>
                            
                            <Row className="mb-3">
                                <Col md={6}><strong>Periodo solicitado:</strong> Año {selectedBaja.compromiso.año} Cuatrimestre {selectedBaja.compromiso.cuatrimestre}</Col>
                                <Col md={6} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}><strong>Motivo:</strong> {selectedBaja.motivo}</Col>
                            </Row>

                            <Row>
                                {selectedBaja.fecha_evaluacion && (
                                    <Col md={6} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}><strong>Fecha de Evaluacion:</strong> {new Date(selectedBaja.fecha_evaluacion).toLocaleDateString()}</Col>

                                )}

                                {selectedBaja.comentarios && (
                                    <Col md={6} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}><strong>Comentarios de Evaluación:</strong> {selectedBaja.comentarios}</Col>
                                )}
                            </Row>
                        </div>
                    ) : (
                        <NuevaBajaProvisoria onSuccess={handleSuccess} compromiso = {compromiso} />
                    )}
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

export default BajaProvisoria;