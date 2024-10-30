import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import NuevaProrroga from './NuevaProrroga';

const Prorroga = () => {
    const { authTokens } = useAuth();
    const [prorrogas, setProrrogas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(''); // Almacena la URL del PDF seleccionado
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
        setSelectedPdf(null); // Limpiar el PDF seleccionado al cerrar
    };

    const handleShowModal = (pdfUrl) => {
        setSelectedPdf(`http://127.0.0.1:8000${pdfUrl}`); // Establecer el PDF seleccionado
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
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Motivo</th>
                            <th>Fecha Solicitud</th>
                            <th>Estado</th>
                            <th>Analítico</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prorrogas.map((prorroga) => (
                            <tr key={prorroga.id}>
                                <td>{prorroga.materia.nombre}</td>
                                <td style={{ whiteSpace: 'normal', wordWrap: 'break-word', maxWidth: '200px' }}>{prorroga.motivo}</td>
                                <td>{new Date(prorroga.fecha_solicitud).toLocaleDateString()}</td>
                                <td>{prorroga.estado}</td>
                                <td>
                                    <span
                                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                        onClick={() => {
                                            handleShowModal(prorroga.analitico);
                                        }}>
                                        Ver Documento
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
                    {selectedPdf ? (
                        <iframe
                            src={selectedPdf}
                            title="PDF Analítico"
                            style={{ width: '100%', height: '500px', border: 'none' }}
                        />
                    ) : (
                        <NuevaProrroga onSuccess={handleSuccess} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Prorroga;