import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";

const ResumenAlumno = () => {
    const { authTokens } = useAuth();
    const [saldoVencido, setSaldoVencido] = useState(0);
    const [estadoAlumno, setEstadoAlumno] = useState(''); // Este valor se obtiene de otro endpoint
    const [proximoVencimiento, setProximoVencimiento] = useState(''); // Este valor lo obtendrás luego

    useEffect(() => {
        // Obtener el saldo vencido
        const fetchSaldoVencido = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/resumenAlumno/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.refresh}`, // Asegúrate de usar el token de acceso
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el saldo vencido');
                }

                const data = await response.json();
                //console.log(data)
                setSaldoVencido(data.saldoVencido); // Asegúrate de que esta clave exista en el JSON de respuesta
                setProximoVencimiento(data.proximaFechaVencimiento)
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchSaldoVencido();
    }, [authTokens]);

    // Este useEffect se ejecuta cada vez que cambia el saldoVencido
    useEffect(() => {
        if (saldoVencido > 0) {
            setEstadoAlumno("Inhabilitado");
        } else {
            setEstadoAlumno("Habilitado");
        }
    }, [saldoVencido]);

    return (
        <>
            <Row>
                <Col xs={12} md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>$ {saldoVencido}</Card.Title>
                            <Card.Text>
                                Saldo Vencido
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body className="text-center bg-light">
                            <Card.Title>{proximoVencimiento || "No disponible"}</Card.Title>
                            <Card.Text>
                                Próximo Vencimiento
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body className="text-center bg-light">
                            <Card.Title>{estadoAlumno || "No disponible"}</Card.Title>
                            <Card.Text>
                                Estado
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <br />
        </>
    );
};

export default ResumenAlumno;