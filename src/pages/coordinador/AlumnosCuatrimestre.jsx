import React, { useEffect, useState } from 'react';
import { Table, Pagination, Form, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import ExportarDatos from '../../components/ExportarDatos'

const AlumnosCuatrimestre = () => {
    const [firmantes, setFirmantes] = useState([]);
    const [error, setError] = useState(null); // Manejo de errores
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [filterFirmo, setFilterFirmo] = useState('todos'); // Estado para el filtro de firma de compromiso
    const [filterEstado, setFilterEstado] = useState('todos'); // Estado para el filtro de firma de compromiso

    const navigate = useNavigate(); // Hook para redirigir

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
                setError(err.message);
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

        const matchesEstadoFilter = 
            filterEstado === 'todos' || 
            (filterEstado === 'habilitado' && firmante.alumno.pago_al_dia) ||
            (filterEstado === 'inhabilitado' && !firmante.alumno.pago_al_dia);

        return matchesSearch && matchesFirmoFilter && matchesEstadoFilter;
    });

    // Contar el total de firmantes y no firmantes
    const totalFirmantes = firmantes.filter(firmante => firmante.firmo_compromiso).length;
    const totalNoFirmantes = firmantes.length - totalFirmantes;

    // Para la paginacion
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFirmantes.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredFirmantes.length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    // Función que se ejecuta al hacer clic en una fila
    const handleRowClick = (firmante) => {
        // Aquí puedes pasar firmante.legajo o firmante.id si necesitas pasarlo en la URL
        navigate('/coordinador/perfilAlumno', { state: { firmante: firmante } });
    };

    // Preparacion de datos para la exportación
    const encabezados = [
        { label: 'Legajo', key: 'legajo' },
        { label: 'DNI', key: 'dni' },
        { label: 'Apellido', key: 'apellido' },
        { label: 'Nombre', key: 'nombre' },
        { label: 'Correo', key: 'email' },
        { label: 'Cantidad de Materias', key: 'materiasCount' },
        { label: 'Compromiso Firmado', key: 'firmo_compromiso' },
        { label: 'Estado', key: 'pago_al_dia' },
    ];

    const datosExportacion = currentItems.map(firmante => ({
        legajo: firmante.alumno.legajo,
        dni: firmante.alumno.dni,
        apellido: firmante.alumno.apellido,
        nombre: firmante.alumno.nombre,
        email: firmante.alumno.email,
        materiasCount: firmante.alumno.materias.length,
        firmo_compromiso: firmante.firmo_compromiso ? 'SI' : 'NO',
        pago_al_dia: firmante.alumno.pago_al_dia ? 'Habilitado' : 'Inhabilitado',
    }));

    // Calcula el título basado en los filtros seleccionados
    const generarTitulo = () => {
        let titulo = "Alumnos cursantes del cuatrimestre";
        if (filterFirmo !== 'todos') {
            titulo += filterFirmo === 'firmo' ? " con compromiso firmado" : " sin compromiso firmado";
        }
        if (filterEstado !== 'todos') {
            titulo += ` con estado ${filterEstado}`;
        }
        return titulo;
    };

    return (
        <>
            {console.log(firmantes)}
            {error ? (
                <p>No se ha podido cargar los datos</p>
            ) : (
                <>
                    <Row className="justify-content-center">
                        <Col xs={12} md={4}>
                            <Card className="text-center bg-light">
                                <Card.Body>
                                    <Card.Title>{firmantes.length}</Card.Title>
                                    <Card.Text className="text-secondary">
                                        Total de alumnos inscriptos en el cuatrimestre
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={4}>
                            <Card className="text-center bg-light">
                                <Card.Body>
                                    <Card.Title>{totalFirmantes} / {firmantes.length}</Card.Title>
                                    <Card.Text className="text-secondary">
                                        Total de alumnos firmantes del compromiso actual
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Form className="d-flex justify-content-between mb-3">
                        {/* Filtro de búsqueda */}
                        <Form.Group controlId="search" className="w-50 me-2">
                            <Form.Label>Buscar alumno</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Buscar por apellido o legajo" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>

                        {/* Filtro de firma */}
                        <Form.Group controlId="firmoFilter" className="w-50 ms-2">
                            <Form.Label>Compromiso Firmado</Form.Label>
                            <Form.Select value={filterFirmo} onChange={(e) => setFilterFirmo(e.target.value)}>
                                <option value="todos">Todos</option>
                                <option value="firmo">SI</option>
                                <option value="noFirmo">NO</option>
                            </Form.Select>

                        </Form.Group>
                        {/* Filtro de estado */}
                                                <Form.Group controlId="estadoFilter" className="w-50 ms-2">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                                <option value="todos">Todos</option>
                                <option value="habilitado">Habilitado</option>
                                <option value="inhabilitado">Inhabilitado</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
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
                                <th>Compromiso Firmado</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(firmante => (
                                <tr key={firmante.alumno.id} onClick={() => handleRowClick(firmante.alumno)} style={{ cursor: 'pointer' }}>
                                    <td>{firmante.alumno.legajo}</td>
                                    <td>{firmante.alumno.dni}</td>
                                    <td>{firmante.alumno.apellido}</td>
                                    <td>{firmante.alumno.nombre}</td>
                                    <td>{firmante.alumno.email}</td>
                                    <td>{firmante.alumno.materias.length}</td>
                                    <td>{firmante.firmo_compromiso ? 'SI' : 'NO'}</td>
                                    <td>{firmante.alumno.pago_al_dia ? 'Habilitado' : 'Inhabilitado'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
            <div class="text-end">
                <ExportarDatos 
                    titulo={generarTitulo()}
                    encabezados={encabezados}
                    datos={datosExportacion}
                    //totales={totales}
                />
            </div>
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