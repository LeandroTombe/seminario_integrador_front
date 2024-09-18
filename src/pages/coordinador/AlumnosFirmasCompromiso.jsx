import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlumnosFirmasCompromiso = () => {
    const [firmantes, setFirmantes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [filterFirmo, setFilterFirmo] = useState('todos'); // Estado para el filtro de firma de compromiso

    useEffect(() => {
        const fetchFirmantes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/listadoFirmaCompromisoActual/');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setFirmantes(data);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchFirmantes();
    }, []);

    // Filtrar los firmantes en función del término de búsqueda y si firmaron o no
    const filteredFirmantes = firmantes.filter(firmante => {
        const matchesSearch = 
            firmante.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            firmante.alumno.legajo.toString().includes(searchTerm);

        const matchesFirmoFilter = 
            filterFirmo === 'todos' || 
            (filterFirmo === 'firmo' && firmante.firmo_compromiso) ||
            (filterFirmo === 'noFirmo' && !firmante.firmo_compromiso);

        return matchesSearch && matchesFirmoFilter;
    });

    // Contar el total de firmantes y no firmantes
    const totalFirmantes = firmantes.filter(firmante => firmante.firmo_compromiso).length;
    const totalNoFirmantes = firmantes.length - totalFirmantes;

    // Para la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFirmantes.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredFirmantes.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            {console.log(firmantes)}
            <h2>Total de alumnos firmantes: {totalFirmantes} | No firmantes: {totalNoFirmantes}</h2>

            {/* Filtros de búsqueda y firma de compromiso alineados en la misma fila */}
            <h4>Filtros</h4>
            <Form className="d-flex justify-content-between mb-3">
                <Form.Group controlId="search" className="w-50 me-2">
                    <Form.Control 
                        type="text" 
                        placeholder="Buscar por apellido o legajo" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="firmoFilter" className="w-50 ms-2">
                    <Form.Select value={filterFirmo} onChange={(e) => setFilterFirmo(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="firmo">Firmó</option>
                        <option value="noFirmo">No firmó</option>
                    </Form.Select>
                </Form.Group>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Legajo</th>
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Firmado</th>
                    </tr>
                </thead>
                <tbody>
                {currentItems.map(firmante => (
                    <tr key={firmante.id}>
                        <td>{firmante.alumno.legajo}</td>
                        <td>{firmante.alumno.apellido}</td>
                        <td>{firmante.alumno.nombre}</td>
                        <td>{firmante.alumno.email}</td>
                        <td>{firmante.firmo_compromiso ? 'SI' : 'NO'}</td>
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
    );
};

export default AlumnosFirmasCompromiso;