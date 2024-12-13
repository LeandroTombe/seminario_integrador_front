import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import {Form, Row, Col, Card, Pagination} from 'react-bootstrap';
import ExportarDatos from '../../components/ExportarDatos'
import InformacionFinanciera from '../../components/InformacionFinanciera';

const ListadoPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [filteredPagos, setFilteredPagos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtroFecha, setFiltroFecha] = useState(''); // Nuevo estado para el tipo de filtro
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

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
      case 'cuatrimestre':
        const cuatrimestreInicio = ahora.getMonth() < 7 ? 0 : 7;
        inicio = new Date(ahora.getFullYear(), cuatrimestreInicio, 1).toISOString().split('T')[0];
        fin = new Date(ahora.getFullYear(), cuatrimestreInicio + 6, 0).toISOString().split('T')[0];
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

    // Para la paginacion
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPagos.slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(filteredPagos.length / itemsPerPage);
  
    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //Calcular el total recaudado en el mes actual
  const getTotalRecaudadoMesActual = () => {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    const totalRecaudado = pagos
      .filter((pago) => {
        const fechaPago = new Date(pago.fecha_pago_confirmado);
        return fechaPago >= inicioMes && fechaPago <= finMes;
      })
      .reduce((total, pago) => total + (parseFloat(pago.monto_confirmado) || 0), 0);

    return totalRecaudado;
  };

    // Calcular el total recaudado en el mes de la cuota
    const getTotalRecaudadoMesCuota = () => {
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
  
      return pagos
        .flatMap((pago) => 
          pago.detalles
            .filter(detalle => {
              const mesCuota = new Date(detalle.cuota.fechaPrimerVencimiento).getMonth();
              return mesCuota === ahora.getMonth();
            })
            .map(detalle => parseFloat(detalle.monto_cuota) || 0)
        )
        .reduce((total, monto) => total + monto, 0);
    };

    const getTotalRecaudadoCuatrimestreActual = () => {
      const ahora = new Date();
      const year = ahora.getFullYear();
      const mesActual = ahora.getMonth();
  
      // Definir los rangos de meses para cada cuatrimestre
      const inicioPrimerCuatrimestre = new Date(year, 2, 1); // Marzo
      const finPrimerCuatrimestre = new Date(year, 7, 0);    // Julio (último día)
      const inicioSegundoCuatrimestre = new Date(year, 7, 1); // Agosto
      const finSegundoCuatrimestre = new Date(year, 12, 0);   // Diciembre (último día)
  
      // Determinar el cuatrimestre actual
      let inicioCuatrimestre, finCuatrimestre;
      if (mesActual >= 2 && mesActual <= 6) { // Marzo a Julio
          inicioCuatrimestre = inicioPrimerCuatrimestre;
          finCuatrimestre = finPrimerCuatrimestre;
      } else { // Agosto a Diciembre
          inicioCuatrimestre = inicioSegundoCuatrimestre;
          finCuatrimestre = finSegundoCuatrimestre;
      }
  
      // Filtrar los pagos dentro del cuatrimestre actual
      const totalRecaudado = pagos
          .filter((pago) => {
              const fechaPago = new Date(pago.fecha_pago_confirmado);
              return fechaPago >= inicioCuatrimestre && fechaPago <= finCuatrimestre;
          })
          .reduce((total, pago) => total + (parseFloat(pago.monto_confirmado) || 0), 0);
  
      return totalRecaudado;
    };

    const formatNumber = (number) => {
      return new Intl.NumberFormat('es-AR', { style: 'decimal' }).format(number);
  };
  
  // Luego utiliza la función en tus cálculos
  const totalRecaudadoMesActual = formatNumber(getTotalRecaudadoMesActual());
  const totalRecaudadoMesCuota = formatNumber(getTotalRecaudadoMesCuota());
  const totalRecaudadoCuatrimestreActual = formatNumber(getTotalRecaudadoCuatrimestreActual());

  // Encabezados para la exportación
  const encabezados = [
    { label: 'Nro Recibo', key: 'numero_recibo' },
    { label: 'Legajo', key: 'legajo' },
    { label: 'DNI', key: 'dni' },
    { label: 'Nombre', key: 'nombre' },
    { label: 'Monto Pagado', key: 'monto_pagado' },
    { label: 'Fecha Pago', key: 'fecha_pago' },
    { label: 'Forma de Pago', key: 'forma_pago' },
    { label: 'Concepto de Pago', key: 'concepto_pago' },
  ];

  // Preparación de datos para exportación
  const datosExportacion = filteredPagos.map((pago) => ({
    numero_recibo: pago.numero_recibo,
    legajo: pago.alumno.legajo,
    dni: pago.alumno.dni,
    nombre: `${pago.alumno.apellido} ${pago.alumno.nombre}`,
    monto_pagado: `$ ${pago.monto_confirmado}`,
    fecha_pago: formatDate(pago.fecha_pago_confirmado) || 'N/A',
    forma_pago: pago.forma_pago,
    concepto_pago: pago.detalles
        .map((detalle) => `Cuota ${detalle.cuota.nroCuota}: $${detalle.monto_cuota}`)
        .join(', '),
  }));

  const generarTitulo = () => {
    const ahora = new Date();
    const year = ahora.getFullYear();
    const mesActual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(ahora);
    const cuatrimestre = ahora.getMonth() >= 7 ? "segundo" : "primer";

    let titulo = "Todos los pagos";
  
    if (filtroFecha === "mes") {
      titulo += ` de ${mesActual} de ${year}`;
    } else if (filtroFecha === "cuatrimestre") {
      titulo += ` del ${cuatrimestre} cuatrimestre de ${year}`;
    } else if (filtroFecha === "año") {
      titulo += ` de ${year}`;
    } else if (filtroFecha === "rango" && fechaInicio && fechaFin) {
      titulo += ` desde ${fechaInicio} hasta ${fechaFin}`;
    }
  
    return titulo;
  };

  return (
    <div>
      {console.log(pagos)}
      <Row className="justify-content-center">
        <Col xs={12} md={4}>
          <Card className="text-center bg-light">
            <Card.Body>
              <Card.Title>$ {totalRecaudadoCuatrimestreActual}</Card.Title>
              <Card.Text className="text-secondary">
                Total recaudado en el cuatrimestre actual
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="text-center bg-light">
            <Card.Body>
              <Card.Title>$ {totalRecaudadoMesActual}</Card.Title>
              <Card.Text className="text-secondary">
                Total recaudado en el mes actual
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="text-center bg-light">
            <Card.Body>
              <Card.Title>$ {totalRecaudadoMesCuota}</Card.Title>
              <Card.Text className="text-secondary">
                Total recaudado del mes actual
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
        <br />
      { pagos.length === 0 ? (
        <p>No existen pagos registrados</p>
      ) : (
        <>
              <Form>
                <Row className="align-items-end">
                  <Col>
                    <Form.Group controlId="searchTerm">
                      <Form.Label>Buscar alumno</Form.Label>
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
                      <Form.Label>Periodo</Form.Label>
                      <Form.Control as="select" value={filtroFecha} onChange={handleFiltroFechaChange}>
                        <option value="">Seleccionar Filtro</option>
                        <option value="mes">Mes Actual</option>
                        <option value="cuatrimestre">Cuatrimestre Actual</option>
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
                <th>Nro Recibo</th>
                <th>Legajo</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Monto Pagado</th>
                <th>Fecha Pago</th>
                <th>Forma de Pago</th>
                <th>Concepto de Pago</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.numero_recibo}</td>
                  <td>{pago.alumno.legajo}</td>
                  <td>{pago.alumno.dni}</td>
                  <td>{pago.alumno.apellido} {pago.alumno.nombre}</td>
                  <td>$ {pago.monto_confirmado}</td>
                  <td>{formatDate(pago.fecha_pago_confirmado) || 'N/A'}</td>
                  <td>{pago.forma_pago}</td>
                  <td>
                      <>
                          {pago.detalles.map((detalle) => (
                              <li key={detalle.id}>
                                  Cuota {detalle.cuota.nroCuota}: $ {detalle.monto_cuota}
                              </li>
                          ))}
                      </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end gap-2">
              {/*<InformacionFinanciera pagos={pagos}></InformacionFinanciera>*/}
              <ExportarDatos 
                  titulo={generarTitulo()}
                  encabezados={encabezados}
                  datos={datosExportacion}
                  totales={`Total recaudado: $${filteredPagos.reduce((total, pago) => total + (parseFloat(pago.monto_confirmado) || 0), 0).toFixed(2)}`}
              />
          </div>

                    {/* Componente de paginación de React-Bootstrap */}
                    <Pagination className="pagination-container">
                        <Pagination.Prev
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
        </>
      )}

    </div>
  );
};

export default ListadoPagos;