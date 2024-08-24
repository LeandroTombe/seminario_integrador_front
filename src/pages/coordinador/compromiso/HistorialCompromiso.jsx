import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Pagination, Accordion, Card, Modal } from 'react-bootstrap';
import Sidebar from "../SidebarCoordinador";
import './HistorialCompromiso.css';
import Layout from '../../../Layout'

function HistorialCompromiso() {
  const [compromisos, setCompromisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' para mostrar primero los más nuevos
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Número de elementos por página

  const [showModal, setShowModal] = useState(false);
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
    setPdfUrl(null);
  };

  return (
    <Layout>
      <Sidebar/>
        <h1>Historial de Compromisos de Pago</h1>
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
              <div>
                {currentItems.map((compromiso, index) => (
                  <Accordion key={index} defaultActiveKey="0" className="">
                    <Accordion.Header className="">
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                        <span>Año: {compromiso.año}</span>
                        <span>Cuatrimestre: {compromiso.cuatrimestre}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <p><strong>Valor de Matrícula:</strong> {compromiso.importe_matricula}</p>
                      <p><strong>Valor de Cuota Reducida:</strong> {compromiso.importe_reducido}</p>
                      <p><strong>Valor de Cuota Completa:</strong> {compromiso.importe_completo}</p>
                      <p><strong>Valor de Primer Mora Completa:</strong> {compromiso.importe_pri_venc_comp}</p>
                      <p><strong>Valor de Primer Mora Reducida:</strong> {compromiso.importe_pri_venc_red}</p>
                      <p><strong>Valor de Segunda Mora Completa:</strong> {compromiso.importe_seg_venc_comp}</p>
                      <p><strong>Valor de Segunda Mora Reducida:</strong> {compromiso.importe_seg_venc_red}</p>
                      {compromiso.compromiso_contenido && (
                        <Button 
                          variant="secondary" 
                          onClick={() => handleVisualizarPDF(compromiso.compromiso_contenido)}
                          className="mt-3"
                        >
                          Visualizar PDF
                        </Button>
                      )}
                    </Accordion.Body>
                  </Accordion>
                ))}
              </div>

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

      {/* Modal para mostrar el PDF */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Compromiso de Pago PDF</Modal.Title>
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
            <p>No se pudo cargar el PDF.</p>
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