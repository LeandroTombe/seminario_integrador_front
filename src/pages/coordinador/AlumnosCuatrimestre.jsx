import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AlumnosCuatrimestre = () => {
    const [firmantes, setFirmantes] = useState([]);
    const [error, setError] = useState(null); // Manejo de errores
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        const fetchFirmantes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/listadoAlumnosInscriptos/');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setFirmantes(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFirmantes();
    }, []);

    // Filtrar los firmantes en función del término de búsqueda
    const filteredFirmantes = firmantes.filter(firmante => 
        firmante.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firmante.legajo.toString().includes(searchTerm)
    );

    // Para la paginacion
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFirmantes.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredFirmantes.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
        <>
            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    <h2>Total de alumnos inscriptos: {firmantes.length}</h2>
                    
                    {/* Campo de búsqueda */}
                    <Form.Group controlId="search">
                        <Form.Label>Buscar Alumno</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Buscar por apellido o legajo" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form.Group>
                    <br />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Legajo</th>
                                <th>DNI</th>
                                <th>Apellido</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Cantidad de Materias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(firmante => (
                                <tr key={firmante.id}>
                                    <td>{firmante.legajo}</td>
                                    <td>{firmante.dni}</td>
                                    <td>{firmante.apellido}</td>
                                    <td>{firmante.nombre}</td>
                                    <td>{firmante.email}</td>
                                    <td>{firmante.materias.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
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

export default AlumnosCuatrimestre;