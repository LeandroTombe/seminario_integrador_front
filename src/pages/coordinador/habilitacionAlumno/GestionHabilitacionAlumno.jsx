import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Card, Row, Col, Pagination, Form } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import { id } from 'date-fns/locale';

const GestionHabilitacionAlumno = () => {
  const { authTokens } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroVencido, setFiltroVencido] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [firmantes, setFirmantes] = useState([]);
  //const [inhabilitados, setInhabilitados] = useState(0);
  const [error, setError] = useState(null);
  const [mes, setMes] = useState([]);
  const [inhabilitados, setInhabilitados] = useState(0);
  const [filtroEstado, setFiltroEstado] = useState('todos');

    useEffect(() => {
      const fetchultimacuotapagada = async () => {
          try {
              const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/ultimacuotapagada/');
              if (!response.ok) {
                  throw new Error('Error al obtener los datos');
              }
              const data = await response.json();
              setAlumnos(data);

              // Calcular el número inicial de inhabilitados
              const initialInhabilitados = data.filter(alumno => !alumno.pago_al_dia).length;
              setInhabilitados(initialInhabilitados);

          } catch (err) {
              setError(err.message);
          }
      };

      fetchultimacuotapagada();
  }, []);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar el cambio de filtro de estado
  const handleFiltroEstadoChange = (event) => {
    setFiltroEstado(event.target.value);
  };

  const handleCambiarEstado = (id, pagoAlDia) => {
    const nuevoEstado = !pagoAlDia; // Cambia el estado a lo contrario del actual
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Esto cambiará el estado del alumno a a ${nuevoEstado ? 'habilitado' : 'inhabilitado'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hacer la petición para cambiar el estado
        fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/${id}/cambiar-estado-pago/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.refresh}` // Incluye el token si usas autenticación
          },
          body: JSON.stringify({ pago_al_dia: nuevoEstado })
        })
          .then(response => response.json())
          .then(data => {
            // Actualizar la lista de alumnos para reflejar el cambio
            setAlumnos(prevAlumnos => {
              const updatedAlumnos = prevAlumnos.map(alumno =>
                alumno.id === id ? { ...alumno, pago_al_dia: nuevoEstado } : alumno
              );
              // Actualizar el estado de inhabilitados
              const nuevosInhabilitados = updatedAlumnos.filter(alumno => !alumno.pago_al_dia).length;
              setInhabilitados(nuevosInhabilitados); // Recalcular el número de inhabilitados
              return updatedAlumnos;
            });
            Swal.fire('Estado cambiado', `El estado de pago ha sido ${nuevoEstado ? 'habilitado' : 'inhabilitado'}.`, 'success');
          })
          .catch(error => {
            console.error('Error al cambiar el estado de pago:', error);
            Swal.fire('Error', 'No se pudo cambiar el estado de pago.', 'error');
          });
      }
    });
  };

  // Filtrar alumnos según el filtro de estado
  const filteredAlumnos = alumnos.filter(alumno => {
    const matchesSearch = 
            alumno.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alumno.legajo.toString().includes(searchTerm);
    
    const matchesEstadoFilter = 
            filtroEstado === 'todos' || 
            (filtroEstado === 'habilitado' && alumno.pago_al_dia) ||
            (filtroEstado === 'inhabilitado' && !alumno.pago_al_dia);
    
  return matchesSearch && matchesEstadoFilter;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlumnos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlumnos.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Total de alumnos con cuotas vencidas
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

   // tomar el mes de ultimo pago
   useEffect(() => {
    const mespagado = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/ultimacuotapagada/`);
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            setMes(data);
        } catch (err) {
            setError(err.message);
        }
    };

    mespagado();
}, []);

  const totalFirmantes = firmantes.filter(firmante => firmante.firmo_compromiso).length;

  // Función para obtener el nombre del mes a partir de la fecha
  const obtenerNombreMes = (fecha) => {
    const date = new Date(fecha);
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return meses[date.getMonth()];
  };

  return (
    <div>
        <Row className="justify-content-center">
            <Col xs={12} md={5}>
                <Card className="text-center bg-light">
                    <Card.Body>
                        <Card.Title>{inhabilitados} / {totalFirmantes}</Card.Title>
                        <Card.Text className="text-secondary">
                            Total de alumnos inhabilitados sobre total de alumnos firmantes del compromiso actual
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <br />
        <Form className="d-flex justify-content-between mb-3">
          {/* Filtro de búsqueda (placeholder para si quieres agregarlo luego) */}
          <Form.Group controlId="search" className="w-50 me-2">
            <Form.Label>Buscar alumno</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Buscar por apellido o legajo" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          {/* Filtro de estado */}
          <Form.Group controlId="estadoFilter" className="w-50 ms-2">
            <Form.Label>Estado Actual</Form.Label>
            <Form.Select value={filtroEstado} onChange={handleFiltroEstadoChange}>
              <option value="todos">Todos</option>
              <option value="habilitado">Habilitado</option>
              <option value="inhabilitado">Inhabilitado</option>
            </Form.Select>
          </Form.Group>
        </Form>

        <Table striped bordered hover>
      <thead>
        <tr>
          <th>Legajo</th>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Estado Actual</th>
          <th>Último Mes Pagado</th>
          <th>Cuotas Vencidas</th> {/* Nueva columna para las cuotas vencidas */}
        </tr>
      </thead>
      <tbody>
        {currentItems.map((item) => {
          // Obtener el importe de la última cuota pagada (si existe)
          const ultimaCuotaPagada = item.cuotas_vencidas.length > 0
            ? Math.max(...item.cuotas_vencidas.map((cuota) => cuota.importePagado || 0))
            : 0;

          return (
            <tr key={item.id}>
              <td>{item.legajo}</td>
              <td>{item.dni}</td>
              <td>{`${item.apellido} ${item.nombre}`}</td>
              <td>{item.email}</td>
              <td>{item.pago_al_dia ? 'Habilitado' : 'Inhabilitado'}</td>
              <td>{item.ultima_cuota_pagada || 'Sin pagos'}</td> {/* Mostrar 'Sin pagos' si no hay pagos previos */}
              
              {/* Nueva columna para mostrar las cuotas vencidas */}
              <td>
                {console.log(item.cuotas_vencidas)}
                {item.cuotas_vencidas && item.cuotas_vencidas.length > 0 ? (
                  <ul>
                    {item.cuotas_vencidas
                      .map((cuota) => (
                        <li key={cuota.id}>
                          {/* Obtener el nombre del mes a partir de la fecha */}
                          {cuota}
                        </li>
                      ))}
                  </ul>
                ) : (
                  'No tiene cuotas vencidas'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>

      <Pagination>
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default GestionHabilitacionAlumno;