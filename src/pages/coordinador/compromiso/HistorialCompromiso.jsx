import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import Sidebar from "../SidebarCoordinador";
import './HistorialCompromiso.css';
import Layout from '../../../Layout';
import InfoCompromiso from '../../../components/InfoCompromiso';

function HistorialCompromiso() {
  const [compromisos, setCompromisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const [showModal, setShowModal] = useState(false);
  const [selectedCompromiso, setSelectedCompromiso] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchCompromisos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/historialCompromiso/');
        if (!response.ok) {
          throw new Error('Error al obtener el historial de compromisos de pago');
        }
        const data = await response.json();
        setCompromisos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompromisos();
  }, []);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedCompromisos = compromisos.sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.año, a.cuatrimestre * 6) - new Date(b.año, b.cuatrimestre * 6);
    } else {
      return new Date(b.año, b.cuatrimestre * 6) - new Date(a.año, a.cuatrimestre * 6);
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCompromisos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedCompromisos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleVisualizarPDF = (url) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedCompromiso(null);
      setPdfUrl(null);
    }, 300); // Se agrega un pequeño delay para asegurar que el modal se cierra completamente antes de resetear el estado
  };

  const handleRowClick = (compromiso) => {
    setSelectedCompromiso(compromiso);
    setShowModal(true);
  };

  return (
    <Layout>
      <Sidebar />
      <h1>Historial de Valores y Compromisos de Pago</h1>
      <div className="containerConfig">
        <Form.Group controlId="sortOrder" style={{ maxWidth: '200px', marginBottom: '20px' }}>
          <Form.Label>Ordenar por</Form.Label>
          <Form.Control as="select" value={sortOrder} onChange={handleSortChange}>
            <option value="desc">Más nuevos primero</option>
            <option value="asc">Más antiguos primero</option>
          </Form.Control>
        </Form.Group>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <p>Selecciona una fila para visualizar el detalle</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Cuatrimestre</th>
                  <th>Matrícula</th>
                  <th>Cuota Completa</th>
                  <th>Cuota Reducida</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((compromiso, index) => (
                  <tr key={index} onClick={() => handleRowClick(compromiso)}>
                    <td>{compromiso.año}</td>
                    <td>{compromiso.cuatrimestre}</td>
                    <td>{compromiso.importe_matricula}</td>
                    <td>{compromiso.importe_completo}</td>
                    <td>{compromiso.importe_reducido}</td>
                    <td>
                      {compromiso.compromiso_contenido && (
                        <span
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el click en el texto active el click de la fila
                            handleVisualizarPDF(compromiso.compromiso_contenido);
                          }}
                        >
                          Visualizar PDF
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination>
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </div>

      {/* Modal para mostrar el compromiso o el PDF */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{pdfUrl ? "Compromiso de Pago PDF" : "Detalle del Compromiso"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl ? (
            <iframe 
              src={`http://127.0.0.1:8000${pdfUrl}`} 
              width="100%" 
              height="500px" 
              title="Compromiso de Pago PDF"
            />
          ) : (
            selectedCompromiso && <InfoCompromiso compromiso={selectedCompromiso} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default HistorialCompromiso;