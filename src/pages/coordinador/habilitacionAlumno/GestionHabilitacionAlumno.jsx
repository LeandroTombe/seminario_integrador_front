import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Form, Row, Col, Pagination } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import { Card } from 'react-bootstrap';
import { id } from 'date-fns/locale';

const GestionHabilitacionAlumno = () => {
  const { authTokens } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroVencido, setFiltroVencido] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [firmantes, setFirmantes] = useState([]);
  const [inhabilitados, setInhabilitados] = useState([]);
  const [error, setError] = useState(null);
  const [mes, setMes] = useState([]);



    useEffect(() => {
      const fetchultimacuotapagada = async () => {
          try {
              const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/ultimacuotapagada/');
              if (!response.ok) {
                  throw new Error('Error al obtener los datos');
              }
              const data = await response.json();
              setAlumnos(data);
          } catch (err) {
              setError(err.message);
          }
      };

      fetchultimacuotapagada();
  }, []);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFiltroVencidoChange = (e) => {
    setFiltroVencido(e.target.value);
  };

  const handleCambiarEstado =  (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esto cambiará el estado de pago al día a vencido.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hacer la petición para cambiar el estado
        const response = fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/${id}/cambiar-estado-pago/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authTokens.refresh}` // Incluye el token si usas autenticación
            },
            body: JSON.stringify({ pago_al_dia: false })
        
        })
          .then(response => response.json())
          .then(data => {
            // Actualizar la lista de alumnos para reflejar el cambio
            setAlumnos(prevAlumnos =>
              prevAlumnos.map(alumno =>
                alumno.id === id ? { ...alumno, pago_al_dia: false } : alumno
              )
            );
            Swal.fire('Estado cambiado', 'El estado de pago ha sido actualizado.', 'success');
          })
          .catch(error => {
            console.error('Error al cambiar el estado de pago:', error);
            Swal.fire('Error', 'No se pudo cambiar el estado de pago.', 'error');
          });
      }
    });
  };

  // Filtrar alumnos por nombre, apellido y estado de pago (vencido o no)
  const filteredAlumnos = alumnos.filter((alumno) => {
    const nombre = alumno.nombre || ''; // Verifica si 'nombre' existe
    const apellido = alumno.apellido || ''; // Verifica si 'apellido' existe
    const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apellido.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPagoAlDia = filtroVencido === 'todos' || 
                             (filtroVencido === 'vencidas' && !alumno.pago_al_dia) || 
                             (filtroVencido === 'al_dia' && alumno.pago_al_dia);
    return matchesSearch && matchesPagoAlDia;
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



  useEffect(() => {
    const fetchInhabilitados = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/ihhabilitados/');
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            const data = await response.json();
            setInhabilitados(data);
        } catch (err) {
            setError(err.message);
        }
    };

    fetchInhabilitados();
}, []);

  const totalFirmantes = firmantes.filter(firmante => firmante.firmo_compromiso).length;


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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Legajo</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado actual</th>
            <th>Ultimo Mes Pagado</th>
            <th>Cambiar Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.legajo}</td>
              <td>{item.dni}</td>
              <td>{`${item.apellido} ${item.nombre}`}</td>
              <td>{item.email}</td>
              <td>{item.pago_al_dia ? 'Habilitado' : 'Inhabilitado'}</td>
              <td>{item.ultima_cuota_pagada}</td>
              <td>
                {item.pago_al_dia ? (
                <button
                  className="btn btn-warning"
                  onClick={() => handleCambiarEstado(item.id)}
                >
                  Inhabilitar
                </button>) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleCambiarEstado(item.id)}
                >
                  Habilitar
                </button>
                )}
              </td>
            </tr>
          ))}
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