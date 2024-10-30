import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Alert, Form, Row, Col, Pagination, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const GestionProrroga = () => {
    const { authTokens } = useAuth();
    const [prorrogas, setProrrogas] = useState([]);
    const [filteredProrrogas, setFilteredProrrogas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalPDF, setShowModalPDF] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(''); // Almacena la URL del PDF seleccionado
    const [selectedProrroga, setSelectedProrroga] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Cambia este valor según lo que desees

    useEffect(() => {
        const fetchProrrogas = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/listado-prorrogas/');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error('Error al obtener las prorrogas');
                }
                setProrrogas(data);
                setFilteredProrrogas(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchProrrogas();
    }, []);

    const actualizarEstadoProrroga = async (id, nuevoEstado) => {
        // Preguntar confirmación al usuario
        const confirm = window.confirm(`¿Está seguro que desea marcar la prórroga como "${nuevoEstado}"?`);
        if (!confirm) return; // Si no confirma, salimos de la función

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/v1/estudiantes/prorroga/${id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authTokens.refresh}`,
                    },
                    body: JSON.stringify({ estado: nuevoEstado }),
                }
            );
            if (!response.ok) throw new Error('No se pudo actualizar el estado.');

            setMessage(`Prórroga ${nuevoEstado.toLowerCase()} exitosamente.`);
            setProrrogas((prev) =>
                prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
            );
            setShowModal(false);
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudo actualizar la prórroga.');
        }
    };

    const filtrarProrrogas = () => {
        let resultados = prorrogas;

        if (searchTerm) {
            resultados = resultados.filter((p) =>
                p.alumno.legajo.toString().includes(searchTerm) || 
                p.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (estadoFiltro) {
            resultados = resultados.filter((p) => p.estado.toLowerCase() === estadoFiltro.toLowerCase());
        }

        setFilteredProrrogas(resultados);
    };

    useEffect(() => {
        filtrarProrrogas();
    }, [searchTerm, estadoFiltro, prorrogas]);

    const handleShowModalPDF = (url) => {
        setSelectedPdf(url)
        setShowModalPDF(true);
    }

    const handleShowModal = (prorroga) => {
        setSelectedProrroga(prorroga);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowModalPDF(false);
        setSelectedProrroga(null);
        setSelectedPdf(null)
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Función para contar las prórrogas pendientes
    const contarProrrogasPendientes = () => {
        return prorrogas.filter(p => p.estado === 'Pendiente').length;
    };

    // Lógica para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProrrogas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProrrogas.length / itemsPerPage);

    return (
        <>
            <Row className="justify-content-center">
                <Col xs={12} md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>{contarProrrogasPendientes()}</Card.Title>
                            <Card.Text className="text-secondary">
                                Prórrogas pendientes de revisión
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {prorrogas.length === 0 ? (
                <p className="mt-3">No existen solicitudes de prórrogas</p>
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
                            <th>Materia</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((prorroga) => (
                            <tr key={prorroga.id}>
                                <td>{prorroga.alumno.legajo}</td>
                                <td>{prorroga.alumno.dni}</td>
                                <td>{prorroga.alumno.apellido}, {prorroga.alumno.nombre}</td>
                                <td>{prorroga.alumno.email}</td>
                                <td>{prorroga.materia.nombre}</td>
                                <td>{prorroga.estado}</td>
                                <td>
                                    {prorroga.estado === 'Pendiente' ? (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleShowModal(prorroga)}
                                        >
                                            Evaluar Prórroga
                                        </Button>
                                    ) : (
                                        <span
                                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                            onClick={() => {
                                                handleShowModalPDF(prorroga.analitico);
                                            }}>
                                            Ver Analítico
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </>
            )}

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Evaluar Prórroga</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProrroga && (
                        <>
                            <h4><b>Fecha de Solicitud:</b> {new Date(selectedProrroga.fecha_solicitud).toLocaleDateString()}</h4>
                            <h4><b>Materia:</b> {selectedProrroga.materia.nombre}</h4>
                            <h4><b>Motivo:</b></h4>
                            <p style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{selectedProrroga.motivo}</p>
                            <h4><b>Certificado Analítico:</b></h4>
                            <iframe
                                src={selectedProrroga.analitico}
                                title="PDF Analítico"
                                style={{ width: '100%', height: '400px', border: 'none' }}
                            />
                            <div className="d-flex justify-content-end mt-4">
                                <Button
                                    variant="success"
                                    className="me-2"
                                    onClick={() => actualizarEstadoProrroga(selectedProrroga.id, 'Aprobada')}
                                >
                                    Aprobar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => actualizarEstadoProrroga(selectedProrroga.id, 'Rechazada')}
                                >
                                    Rechazar
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showModalPDF} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Certificado Analítico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <iframe
                            src={selectedPdf}
                            title="PDF Analítico"
                            style={{ width: '100%', height: '500px', border: 'none' }}
                        />
                </Modal.Body>
            </Modal>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Paginación */}
            <Pagination>
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
        </>
    );
};

export default GestionProrroga;
