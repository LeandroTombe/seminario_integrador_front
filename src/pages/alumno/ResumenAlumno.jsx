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
            setEstadoAlumno("Habilitado");
        } else {
            setEstadoAlumno("Habilitado");
        }
    }, [saldoVencido]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
    
        const dia = date.getUTCDate().toString().padStart(2, '0');
        const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son de 0 a 11, por eso sumamos 1
        const año = date.getUTCFullYear();
    
        return `${dia}/${mes}/${año}`; // Retorna en formato dd/mm/yyyy
    };

    return (
        <>
            <Row>
                <Col xs={12} md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>$ {saldoVencido}</Card.Title>
                            <Card.Text className="text-secondary">
                                Saldo Vencido
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>{formatDate(proximoVencimiento) || "No disponible"}</Card.Title>
                            <Card.Text className="text-secondary">
                                Próximo Vencimiento
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>{estadoAlumno || "No disponible"}</Card.Title>
                            <Card.Text className="text-secondary">
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