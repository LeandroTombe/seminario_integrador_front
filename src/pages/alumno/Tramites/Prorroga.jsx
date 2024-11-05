import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import NuevaProrroga from './NuevaProrroga';

const Prorroga = () => {
    const { authTokens } = useAuth();
    const [prorrogas, setProrrogas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(''); // Almacena la URL del PDF seleccionado
    const [selectedProrroga, setSelectedProrroga] = useState('')
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Obtener el historial de prórrogas
    const fetchProrrogas = () => {
        fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/tramites/listado-prorroga-alumno/', {
            headers: { Authorization: `Bearer ${authTokens.refresh}` },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al obtener el historial de prórrogas.');
                }
            })
            .then((data) => setProrrogas(data))
            .catch((error) => setError(error.message));
    };

    useEffect(() => {
        fetchProrrogas();
    }, [authTokens]);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProrroga(null)
        setSelectedPdf(null); // Limpiar el PDF seleccionado al cerrar
    };

    const handleShowModal = (prorroga) => {
        setSelectedPdf(`http://127.0.0.1:8000${prorroga.analitico}`); // Establecer el PDF seleccionado
        setSelectedProrroga(prorroga)
        setShowModal(true);
    };

    const handleSuccess = (message) => {
        setMessage(message);
        handleCloseModal();
        fetchProrrogas(); // Actualizar el historial
    };

    return (
        <>
            <h2>Historial de Prórrogas de Regularización</h2>
            {console.log(prorrogas)}
            {prorrogas.length === 0 ? (
                <p>No existen solicitudes de prórrogas anteriores</p>
            ) : (
                <Table bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Fecha Solicitud</th>
                            <th>Estado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prorrogas.map((prorroga) => (
                            <tr
                                key={prorroga.id}
                                className={
                                    prorroga.estado === 'Rechazada'
                                    ? 'table-danger' 
                                    : prorroga.estado === 'Aprobada'
                                    ? 'table-success'
                                    : ''
                                    }
                            >
                                <td>{prorroga.materia.nombre}</td>
                                <td>{new Date(prorroga.fecha_solicitud).toLocaleDateString()}</td>
                                <td>{prorroga.estado}</td>
                                <td>
                                    <span
                                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={() => {
                                            handleShowModal(prorroga);
                                        }}
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
                Solicitar Nueva Prórroga
            </Button>
            <br /><br />
            {message && <Alert variant="success">{message}</Alert>}

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPdf ? "Certificado Analítico" : "Solicitar Nueva Prórroga"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProrroga ? (
                        <>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Fecha de Solicitud</h6>
                                        <p>{new Date(selectedProrroga.fecha_solicitud).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Motivo</h6>
                                        <p style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{selectedProrroga.motivo}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Materia</h6>
                                        <p style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{selectedProrroga.materia.nombre}</p>
                                    </div>
                                    {selectedProrroga.fecha_evaluacion && (
                                        <div className="col-md-6 mb-3">
                                            <h6 className="fw-bold">Fecha de Evaluación</h6>
                                            <p>{new Date(selectedProrroga.fecha_evaluacion).toLocaleDateString()}</p>
                                        </div>
                                    )}

                                    {selectedProrroga.comentarios && (
                                        <div className="col-md-6 mb-3">
                                            <h6 className="fw-bold">Comentarios de Evaluación</h6>
                                            <p style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{selectedProrroga.comentarios}</p>
                                        </div>
                                    )}

                                    <div className="col-md-6 mb-3">
                                        <h6 className="fw-bold">Estado de solicitud</h6>
                                        <p style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{selectedProrroga.estado}</p>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <h6 className="fw-bold">Certificado Analítico</h6>
                                        <iframe
                                            src={selectedPdf}
                                            title="PDF Analítico"
                                            style={{ width: '100%', height: '400px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                        ) : (
                        <NuevaProrroga onSuccess={handleSuccess} />
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

export default Prorroga;