import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, ListGroup, Table, Accordion } from "react-bootstrap";
import Layout from "../../Layout";
import EstadoDeCuenta from "../alumno/EstadoDeCuenta";

const PerfilAlumno = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para redirecciones
  const firmante = location.state?.firmante;

  const [materiasActuales, setMateriasActuales] = useState([]);
  const [materiasAnteriores, setMateriasAnteriores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firmante) {
      const codigosMaterias = firmante.materias.map((materia) => materia);

      fetch("http://127.0.0.1:8000/api/v1/estudiantes/materiasPorCodigo/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigos: codigosMaterias }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMateriasActuales(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener las materias:", error);
          setLoading(false);
        });
    }
  }, [firmante]);

  if (loading) {
    return (
      <Layout>
        <p>Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
      <button onClick={() => navigate("/coordinador/inicio")} className="back-button">← Volver a Inicio</button>
      </div>
      <h1>{firmante.apellido} {firmante.nombre}</h1>
      <div className="containerConfig">
        {firmante ? (
          <>
            <Accordion className="acordion">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Datos Personales</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Nombre completo:</strong> {firmante.apellido} {firmante.nombre}</ListGroup.Item>
                    <ListGroup.Item><strong>DNI:</strong> {firmante.dni}</ListGroup.Item>
                    <ListGroup.Item><strong>Legajo:</strong> {firmante.legajo}</ListGroup.Item>
                    <ListGroup.Item><strong>Teléfono:</strong> {firmante.telefono || "3624316523"}</ListGroup.Item>
                    <ListGroup.Item><strong>Email:</strong> {firmante.email}</ListGroup.Item>
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Datos Académicos</Accordion.Header>
                <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Año de ingreso:</strong> {firmante.ingreso}</ListGroup.Item>
                  <ListGroup.Item><strong>Estado actual:</strong> {firmante.pago_al_dia ? "habilitado" : "inhabilitado"}</ListGroup.Item>
                </ListGroup>
                <br />
                  <h5>Materias cursando actualmente</h5>
                  {materiasActuales.length > 0 ? (
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Materia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materiasActuales.map((materia, index) => (
                          <tr key={index}>
                            <td>{materia.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No está cursando materias actualmente.</p>
                  )}

                  <h5>Materias Cursadas en Años Anteriores</h5>
                  {firmante.ingreso === 2024 ? (
                    <p>No ha cursado materias en años anteriores</p>
                  ) : (
                    <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Año</th>
                        <th>Materia</th>
                        <th>Calificación</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2023</td>
                        <td>Programación I</td>
                        <td>8</td>
                      </tr>
                    </tbody>
                  </Table>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <br />
            <EstadoDeCuenta alumno={firmante} />
          </>
        ) : (
          <p>No se encontraron datos del alumno.</p>
        )}
      </div>
    </Layout>
  );
};

export default PerfilAlumno;