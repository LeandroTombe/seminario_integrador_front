import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form } from 'react-bootstrap';

// Asegúrate de importar el archivo CSS de Bootstrap en tu archivo principal, por ejemplo, en index.js o App.js
import 'bootstrap/dist/css/bootstrap.min.css';

const AlumnosFirmasCompromiso = () => {
    const [firmantes, setFirmantes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    useEffect(() => {
        const fetchFirmantes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/listadoFirmaCompromisoActual/'); // Asegúrate de que esta ruta coincida con la de tu backend
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
        firmante.alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firmante.alumno.legajo.toString().includes(searchTerm)
    );

    // Para la paginacion
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFirmantes.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredFirmantes.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
    
        const dia = date.getUTCDate().toString().padStart(2, '0');
        const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son de 0 a 11, por eso sumamos 1
        const año = date.getUTCFullYear();
    
        return `${dia}/${mes}/${año}`; // Retorna en formato dd/mm/yyyy
    };

    return (
        <>
            <h2>Total de alumnos firmantes del compromiso de pago actual: {firmantes.length}</h2>
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
                        <th>Apellido</th>
                        <th>Nombre</th>
                        <th>Fecha de Firma</th>
                        {/* Agrega más columnas si es necesario */}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(firmante => (
                        <tr key={firmante.id}>
                            <td>{firmante.alumno.legajo}</td>
                            <td>{firmante.alumno.apellido}</td>
                            <td>{firmante.alumno.nombre}</td>
                            <td>{formatDate(firmante.fechaFirma)}</td>
                            {/* Agrega más celdas si es necesario */}
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