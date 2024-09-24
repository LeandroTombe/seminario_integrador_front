import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Form, Row, Col, Pagination } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';

const GestionHabilitacionAlumno = () => {
  const { authTokens } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroVencido, setFiltroVencido] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    // Hacemos la petición al endpoint que devuelve el perfil del alumno autenticado
    fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/habilitaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => setAlumnos(data))
      .catch(error => console.error('Error al obtener los datos de los alumnos:', error));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dia = date.getUTCDate().toString().padStart(2, '0');
    const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const año = date.getUTCFullYear();
    return `${dia}/${mes}/${año}`;
  };

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

  return (
    <div>
        <h3>Alumnos que tienen coutas vencidas</h3>
      

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Legajo</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Estado de Pago</th>
            <th>Estados</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.legajo}</td>
              <td>{item.dni}</td>
              <td>{`${item.apellido} ${item.nombre}`}</td>
              <td>{item.email}</td>
              <td>{item.pago_al_dia ? 'Habilitado' : 'Vencida'}</td>
              <td>
                {item.pago_al_dia ? (
                <button
                  className="btn btn-warning"
                  onClick={() => handleCambiarEstado(item.id)}
                >
                  Cambiar a Vencida
                </button>) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleCambiarEstado(item.id)}
                >
                    Cambiar a Habilitado
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