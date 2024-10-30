import { useAuth } from "../../../context/AuthContext";
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NuevaProrroga = ({ onSuccess }) => {
    const { authTokens } = useAuth();
    const [alumno, setAlumno] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [analitico, setAnalitico] = useState(null);
    const [motivo, setMotivo] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Obtener las materias del alumno
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/estudiantes/materias/', {
        headers: { Authorization: `Bearer ${authTokens.refresh}` },
        })
        .then((response) => response.json())
        .then((data) => setMaterias(data))
        .catch((error) => setError('Error al obtener las materias.'));
    }, []);

    // Obtener información del alumno
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/perfil/', {
        headers: { Authorization: `Bearer ${authTokens.refresh}` },
        })
        .then((response) => response.json())
        .then((data) => setAlumno(data))
        .catch((error) => setError('Error al obtener la información del alumno.'));
    }, []);

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('materia', selectedMateria);
        formData.append('analitico', analitico);
        formData.append('motivo', motivo);

        fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/tramites/prorroga/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authTokens.refresh}` },
        body: formData,
        })
        .then((response) => {
            if (response.ok) {
                onSuccess('Prórroga solicitada exitosamente.');
            } else {
                response.json().then((data) => setError(data.error));
            }
        })
        .catch(() => setError('Error al solicitar la prórroga.'));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
      
        if (file && file.type !== 'application/pdf') {
          setError('El archivo debe ser un PDF.');
          setAnalitico(null); // Resetea el archivo seleccionado
          return;
        }
      
        setError(''); // Limpia el error si el archivo es válido
        setAnalitico(file);
      };

    return (
        <>
            {console.log(materias)}
            {alumno && (
                <div className="mb-4">
                <p><strong>Nombre:</strong> {alumno.apellido}, {alumno.nombre}</p>
                <p><strong>DNI:</strong> {alumno.dni}</p>
                <p><strong>Legajo:</strong> {alumno.legajo}</p>
                <p><strong>Email:</strong> {alumno.email}</p>
                </div>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Materia</Form.Label>
                    <Form.Select
                        value={selectedMateria}
                        onChange={(e) => setSelectedMateria(e.target.value)}
                        required
                    >
                        <option value="">Seleccione una materia</option>
                        {materias.map((materia) => (
                        <option key={materia.codigo_materia} value={materia.codigo_materia}>
                            {materia.nombre}
                        </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Certificado Analítico</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Motivo (opcional)</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                />
                </Form.Group>

                <Button variant="primary" type="submit">
                Solicitar Prórroga
                </Button>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

            </Form>
        </>
    );
};

export default NuevaProrroga;