import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ListadoPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroFecha, setFiltroFecha] = useState(''); // Nuevo estado para el tipo de filtro

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/pagos/all/');
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Error al obtener los pagos');
        }
        setPagos(data);
        setFilteredPagos(data); // Inicialmente muestra todos los pagos
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPagos();
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
    const term = e.target.value;
    setSearchTerm(term);
    filterPagos(term, fechaInicio, fechaFin, filtroFecha);
  };

  const handleDateChange = (type, value) => {
    if (type === 'inicio') {
      setFechaInicio(value);
    } else {
      setFechaFin(value);
    }
    filterPagos(searchTerm, fechaInicio, fechaFin, filtroFecha);
  };

  const handleFiltroFechaChange = (e) => {
    const tipoFiltro = e.target.value;
    setFiltroFecha(tipoFiltro);
    const { inicio, fin } = getRangoFechas(tipoFiltro);
    setFechaInicio(inicio);
    setFechaFin(fin);
    filterPagos(searchTerm, inicio, fin, tipoFiltro);
  };

  const getRangoFechas = (tipo) => {
    const ahora = new Date();
    let inicio = '';
    let fin = '';

    switch (tipo) {
      case 'mes':
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString().split('T')[0];
        fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'semestre':
        const semestreInicio = ahora.getMonth() < 6 ? 0 : 6;
        inicio = new Date(ahora.getFullYear(), semestreInicio, 1).toISOString().split('T')[0];
        fin = new Date(ahora.getFullYear(), semestreInicio + 6, 0).toISOString().split('T')[0];
        break;
      case 'año':
        inicio = new Date(ahora.getFullYear(), 0, 1).toISOString().split('T')[0];
        fin = new Date(ahora.getFullYear(), 11, 31).toISOString().split('T')[0];
        break;
      default:
        inicio = '';
        fin = '';
    }

    return { inicio, fin };
  };

  const filterPagos = (term, startDate, endDate, tipoFiltro) => {
    let filtered = pagos;

    // Filtrar por apellido o legajo
    if (term) {
      filtered = filtered.filter((pago) =>
        pago.alumno.apellido.toLowerCase().includes(term.toLowerCase()) ||
        pago.alumno.legajo.toString().includes(term)
      );
    }

    // Filtrar por fechas
    if (startDate) {
      filtered = filtered.filter(
        (pago) => new Date(pago.fecha_pago_confirmado) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (pago) => new Date(pago.fecha_pago_confirmado) <= new Date(endDate)
      );
    }

    setFilteredPagos(filtered);
  };

  return (
    <div>
      <h1>Listado de Pagos</h1>

      <Form>
        <Row className="align-items-end">
          <Col>
            <Form.Group controlId="searchTerm">
              <Form.Label>Buscar por Apellido o Legajo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese apellido o legajo"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="filtroFecha">
              <Form.Label>Filtro por Fecha</Form.Label>
              <Form.Control as="select" value={filtroFecha} onChange={handleFiltroFechaChange}>
                <option value="">Seleccionar Filtro</option>
                <option value="mes">Mes Actual</option>
                <option value="semestre">Semestre Actual</option>
                <option value="año">Año Actual</option>
                <option value="rango">Seleccionar Fechas</option>
              </Form.Control>
            </Form.Group>
          </Col>

          {filtroFecha === 'rango' && (
            <>
              <Col>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => handleDateChange('inicio', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => handleDateChange('fin', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </>
          )}
        </Row>
      </Form>
        <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Legajo</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Monto</th>
            <th>Fecha Pago</th>
            <th>Forma de Pago</th>
          </tr>
        </thead>
        <tbody>
          {filteredPagos.map((pago) => (
            <tr key={pago.id}>
              <td>{pago.alumno.legajo}</td>
              <td>{pago.alumno.dni}</td>
              <td>{pago.alumno.apellido} {pago.alumno.nombre}</td>
              <td>{pago.monto_confirmado ? `$${pago.monto_confirmado}` : 'N/A'}</td>
              <td>{formatDate(pago.fecha_pago_confirmado) || 'N/A'}</td>
              <td>{pago.forma_pago}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListadoPagos;
