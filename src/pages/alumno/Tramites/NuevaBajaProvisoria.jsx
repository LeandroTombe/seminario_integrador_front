import { useAuth } from "../../../context/AuthContext";
import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const NuevaBajaProvisoria = ({ onSuccess, compromiso }) =>{

    const { authTokens } = useAuth();
    const [alumno, setAlumno] = useState(null);
    const [motivo, setMotivo] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Obtener información del alumno
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/perfil/', {
            headers: { Authorization: `Bearer ${authTokens.refresh}` },
        })
        .then((response) => response.json())
        .then((data) => setAlumno(data))
        .catch(() => setError('Error al obtener la información del alumno.'));
    }, []);

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('motivo', motivo);
        formData.append('año', compromiso[0].año)
        formData.append('cuatrimestre', compromiso[0].cuatrimestre)

        fetch('http://127.0.0.1:8000/api/v1/estudiantes/alumno/tramites/baja/', {
            method: 'POST',
            headers: { Authorization: `Bearer ${authTokens.refresh}` },
            body: formData,
        })
        .then((response) => {
            if (response.ok) {
                onSuccess('Baja provisoria solicitada exitosamente.');
            } else {
                response.json().then((data) => setError(data.error));
            }
        })
        .catch(() => setError('Error al solicitar la baja provisoria.'));
    };

    return (
        <>
            {alumno && (
                <div className="p-3 mb-4">
                    <h5 className="mb-3">Información del Alumno</h5>
                    
                    <Row className="mb-2">
                        <Col md={6}><strong>Nombre:</strong> {alumno.apellido}, {alumno.nombre}</Col>
                        <Col md={6}><strong>DNI:</strong> {alumno.dni}</Col>
                    </Row>
                    
                    <Row className="mb-2">
                        <Col md={6}><strong>Legajo:</strong> {alumno.legajo}</Col>
                        <Col md={6}><strong>Email:</strong> {alumno.email}</Col>
                    </Row>
        
                    <hr />
        
                    <h5 className="mb-3">Solicitarás la baja provisoria para</h5>
                    {compromiso.length > 0 && (
                        <Row>
                            <Col md={6}><strong>Año:</strong> {compromiso[0].año}</Col>
                            <Col md={6}><strong>Cuatrimestre:</strong> {compromiso[0].cuatrimestre}</Col>
                        </Row>
                    )}
                    <br />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Motivo </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={motivo}
                                required
                                onChange={(e) => setMotivo(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Solicitar Baja Provisoria
                        </Button>

                        <br /><br />
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Form>
                
                </div>
            )}
        </>
    );
};

export default NuevaBajaProvisoria;