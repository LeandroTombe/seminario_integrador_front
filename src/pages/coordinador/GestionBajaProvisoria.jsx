import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Alert, Form, Row, Col, Pagination, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import EstadoDeCuenta from '../alumno/EstadoDeCuenta';

const GestionBajaProvisoria = () => {
    const { authTokens } = useAuth();
    const [bajas, setbajas] = useState([]);
    const [filteredBajas, setFilteredBajas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalPDF, setShowModalPDF] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [selectedBaja, setSelectedBaja] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Cambia este valor según lo que desees

    const fetchBajas = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/listado-bajas/');
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Error al obtener las bajas');
            }
            setbajas(data);
            setFilteredBajas(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchBajas();
    }, []);

    const actualizarEstadoBaja = async (id, nuevoEstado, comentarios) => {
        const confirm = window.confirm(`¿Está seguro que desea marcar la baja como "${nuevoEstado}"?`);
        if (!confirm) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/v1/estudiantes/baja/${id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.refresh}`,
                    },
                    body: JSON.stringify({ 
                        estado: nuevoEstado,
                        comentarios: comentarios
                    }),
                }
            );
            if (!response.ok) throw new Error('No se pudo actualizar el estado.');

            setMessage(`Baja ${nuevoEstado.toLowerCase()} exitosamente.`);
            setShowModal(false)

            await fetchBajas();
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudo actualizar la baja.');
        }
    };

    const filtrarBajas = () => {
        let resultados = bajas;

        if (searchTerm) {
            resultados = resultados.filter((p) =>
                p.alumno.legajo.toString().includes(searchTerm) || 
                p.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (estadoFiltro) {
            resultados = resultados.filter((p) => p.estado.toLowerCase() === estadoFiltro.toLowerCase());
        }

        setFilteredBajas(resultados);
    };

    useEffect(() => {
        filtrarBajas();
    }, [searchTerm, estadoFiltro, bajas]);

    const handleShowModalPDF = (baja) => {
        setSelectedBaja(baja);
        setSelectedPdf(baja.analitico)
        setShowModalPDF(true);
    }

    const handleShowModal = (baja) => {
        setSelectedBaja(baja);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowModalPDF(false);
        setSelectedBaja(null);
        setSelectedPdf(null)
        setComentarios(null)
    };

    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para contar las bajas pendientes
    const contarBajasPendientes = () => {
        return bajas.filter(p => p.estado === 'Pendiente').length;
    };

    // Lógica para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBajas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBajas.length / itemsPerPage);

    return (
        <>
            <Row className="justify-content-center">
                <Col xs={12} md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>{contarBajasPendientes()}</Card.Title>
                            <Card.Text className="text-secondary">
                                Bajas pendientes de revisión
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {bajas.length === 0 ? (
                <p className="mt-3">No existen solicitudes de bajas provisorias</p>
            ) : (
                <>
                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Label>Buscar alumno</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por apellido o legajo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobada">Aprobada</option>
                            <option value="Rechazada">Rechazada</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Legajo</th>
                            <th>DNI</th>
                            <th>Alumno</th>
                            <th>Correo</th>
                            <th>Periodo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((baja) => (
                            <tr key={baja.id}>
                                <td>{baja.alumno.legajo}</td>
                                <td>{baja.alumno.dni}</td>
                                <td>{baja.alumno.apellido}, {baja.alumno.nombre}</td>
                                <td>{baja.alumno.email}</td>
                                <td>Año {baja.compromiso.año} Cuatrimestre {baja.compromiso.cuatrimestre}</td>
                                <td>{baja.estado}</td>
                                <td>
                                    {baja.estado === 'Pendiente' ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleShowModal(baja)}
                                        >
                                            Evaluar Baja
                                        </Button>
                                    ) : (
                                        <span
                                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                            onClick={() => {
                                                handleShowModalPDF(baja);
                                            }}>
                                            Ver Detalle
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </>
            )}

            <Modal show={showModal} onHide={handleCloseModal} size="xl" style={{ maxWidth: '150%', margin: '0 auto' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Evaluar Baja Provisoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBaja && (
                        <>
                            <div className="p-3 mb-4">
                                    <Row className="mb-3">
                                        <Col md={6}><strong>Fecha de Solicitud:</strong> {new Date(selectedBaja.fecha_solicitud).toLocaleDateString()}</Col>
                                        <Col md={6}><strong>Estado:</strong> {selectedBaja.estado}</Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6}><strong>Periodo:</strong> Año {selectedBaja.compromiso.año} Cuatrimestre {selectedBaja.compromiso.cuatrimestre}</Col>
                                        <Col md={6} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}><strong>Motivo:</strong> {selectedBaja.motivo}</Col>
                                    </Row>
                            </div>

                            <EstadoDeCuenta alumno={selectedBaja.alumno} />
                            <strong>Al aceptar la baja provisoria, se eliminarán las cuotas con estado "Pendiente"</strong>
                            <Form.Group className="mt-3">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    onChange={(e) => setComentarios(e.target.value)}
                                    placeholder="Ingrese un comentario de evaluación"
                                    required
                                />
                                <div className="d-flex justify-content-end mt-4">
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={() => {actualizarEstadoBaja(selectedBaja.id, 'Aprobada', comentarios);}}
                                    >
                                        Aprobar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            if (!comentarios) {
                                                alert("Debe ingresar un comentario antes de rechazar.");
                                                return;
                                            }
                                            actualizarEstadoBaja(selectedBaja.id, 'Rechazada', comentarios);
                                        }}
                                    >
                                        Rechazar
                                    </Button>
                                </div>
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showModalPDF} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Solicitud de Baja Provisoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBaja && (
                        <div className="p-3 mb-4">
                            <Row className="mb-3">
                                <Col md={6}><strong>Fecha de Solicitud:</strong> {new Date(selectedBaja.fecha_solicitud).toLocaleDateString()}</Col>
                                <Col md={6}><strong>Estado:</strong> {selectedBaja.estado}</Col>
                            </Row>

                            <Row className="mb-3">
                            <Col md={6}><strong>Periodo:</strong> Año {selectedBaja.compromiso.año} Cuatrimestre {selectedBaja.compromiso.cuatrimestre}</Col>
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
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

                    {/* Componente de paginación de React-Bootstrap */}
                    <Pagination className="pagination-container">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
        </>
    );
};

export default GestionBajaProvisoria