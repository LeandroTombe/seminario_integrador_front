import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { ListGroup, Table, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';
import Layout from "../../LayoutAlumno";

const Perfil = () => {
    const [alumno, setAlumno] = useState(null);
    const { authTokens } = useAuth(); // Importa el contexto de autenticación
    const navigate = useNavigate();

    const [materiasActuales, setMateriasActuales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/perfil/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.refresh}` 
            }
        })
            .then(response => response.json())
            .then(data => setAlumno(data))
            .catch(error => console.error('Error al obtener los datos del alumno:', error));
    }, [authTokens.refresh]);

    useEffect(() => {
      if (alumno) {
        const codigosMaterias = alumno.materias.map((materia) => materia);
  
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
    }, [alumno]);
  
    if (loading) {
      return (
        <Layout>
          <p>Cargando...</p>
        </Layout>
      );
    }

    return (
        <Layout>
        <h1 className="text-center mb-4">
            {alumno.apellido} {alumno.nombre}
        </h1>
        <div className="containerConfig">
            <Row className="g-4">
            {/* Columna de Datos Personales */}
            <Col md={6}>
                <h2>Datos Personales</h2>
                <ListGroup variant="flush">
                <ListGroup.Item>
                    <strong>Nombre completo:</strong> {alumno?.apellido} {alumno?.nombre}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>DNI:</strong> {alumno?.dni}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Legajo:</strong> {alumno?.legajo}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Teléfono:</strong> {alumno?.telefono || "3624316523"}
                </ListGroup.Item>
                <ListGroup.Item>
                    <strong>Email:</strong> {alumno?.email}
                </ListGroup.Item>
                </ListGroup>
            </Col>

            {/* Columna de Datos Académicos */}
            <Col md={6}>
                <h2>Datos Académicos</h2>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Año de ingreso:</strong> {alumno?.ingreso}</ListGroup.Item>
                  <ListGroup.Item><strong>Estado actual:</strong> {alumno?.pago_al_dia ? "habilitado" : "inhabilitado"}</ListGroup.Item>
                </ListGroup>
                <br />
                <h5>Materias cursadas actualmente</h5>
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
                <h5 className="mt-4">Materias Cursadas en Años Anteriores</h5>
                {alumno?.ingreso === 2024 ? (
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
            </Col>
            </Row>
        </div>
        </Layout>
    );
};

export default Perfil;