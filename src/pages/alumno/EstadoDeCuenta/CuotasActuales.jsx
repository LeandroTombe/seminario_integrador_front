import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CuotasActuales = ({ authTokens, alumno }) => {
    const [cuotas, setCuotas] = useState([]);
    const [error, setError] = useState(null);
    const [alumnos, setAlumnos] = useState(null);
    const [cuotasSeleccionadas, setCuotasSeleccionadas] = useState([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/v1/estudiantes/alumno/perfil/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.refresh}` 
          }
        })
          .then(response => response.json())
          .then(data => setAlumnos(data))
          .catch(error => console.error('Error al obtener los datos del alumno:', error));
    }, [authTokens.refresh]);

    function tratarfechaForm() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        return `${year}-${month}-${day}`;
    }

    const manejoForm = () => {
        if (!alumno) {
            const fechaHoy = tratarfechaForm();
            const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSd2MWAkLz3BYEFIzFJDy9up1lGKuNACe1oOKLZ4p7Jhs-osVA/viewform?usp=pp_url&entry.1981210019=${alumnos.apellido},+${alumnos.nombre}&entry.246393120=Tecnicatura+Universitaria+en+Programaci%C3%B3n&entry.528240021=${alumnos.dni}&entry.1687154301=${fechaHoy}`;
            window.open(googleFormUrl, '_blank');
        }
    };

    useEffect(() => {
        const fetchCuotas = async () => {
            let url = 'http://127.0.0.1:8000/api/v1/estudiantes/estadoDeCuentaAlumno/';
            let options = {
                headers: {
                    'Authorization': `Bearer ${authTokens.refresh}`, 
                },
            };

            if (alumno) {
                options.method = 'POST';
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ alumno: alumno.id }); 
            } else {
                options.method = 'GET';
            }

            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const data = await response.json();
                setCuotas(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCuotas();
    }, [authTokens, alumno]);

    const getEstado = (cuota) => {
        const today = new Date();
        const fechaVencimiento = new Date(cuota.fechaPrimerVencimiento);
        const ultimoDiaMes = new Date(fechaVencimiento.getFullYear(), fechaVencimiento.getMonth() + 1, 0);

        if (today >= new Date(ultimoDiaMes.getFullYear(), ultimoDiaMes.getMonth() + 1, 1) && cuota.importePagado < cuota.total) {
            return 'Vencida';
        }
    
        return parseFloat(cuota.importePagado) >= parseFloat(cuota.total) ? 'Pagado' : 'Pendiente';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const dia = date.getUTCDate().toString().padStart(2, '0');
        const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const año = date.getUTCFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const handlePago = async () => {
        if (!alumno){
            console.log(alumnos);
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/notificaciones/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.refresh}`
                    },
                    body: JSON.stringify({
                        alumno: alumnos.id,
                        mensaje: `Se ha pagado correctamente la cuota`,
                    })
                });
    
                if (response.ok) {
                    manejoForm();
                } else {
                    console.error('Error al enviar la notificación');
                }
            } catch (error) {
                console.error('Error al procesar el pago:', error);
            }
        }
    };

    const handleSeleccionCuota = (nroCuota) => {
        setCuotasSeleccionadas((prevSeleccionadas) => {
            if (prevSeleccionadas.includes(nroCuota)) {
                // Si ya está seleccionada, desmarcar esta cuota y todas las posteriores
                return prevSeleccionadas.filter(cuota => cuota < nroCuota);
            } else {
                // Si no está seleccionada, añadir esta cuota y permitir seleccionar posteriores
                const nuevasSeleccionadas = [...prevSeleccionadas, nroCuota];
                nuevasSeleccionadas.sort((a, b) => a - b); // Ordenar para mantener el orden correcto
                return nuevasSeleccionadas;
            }
        });
    };

    const isCheckboxDisabled = (cuota) => {
        const estado = getEstado(cuota);
    
        if (estado === 'Pagado') {
            return true; // No permitir seleccionar cuotas ya pagadas
        }
    
        // Obtener la primera cuota que no esté pagada
        const primeraCuotaPendiente = cuotas.find(c => getEstado(c) !== 'Pagado')?.nroCuota || 0;
    
        // Permitir seleccionar la primera cuota pendiente
        if (cuota.nroCuota === primeraCuotaPendiente) {
            return false;
        }
    
        // Verificar si todas las cuotas anteriores están seleccionadas o pagadas
        for (let i = primeraCuotaPendiente; i < cuota.nroCuota; i++) {
            const cuotaAnterior = cuotas.find(c => c.nroCuota === i);
            if (!cuotasSeleccionadas.includes(i) && getEstado(cuotaAnterior) !== 'Pagado') {
                return true; // Deshabilitar la cuota si alguna anterior no está seleccionada ni pagada
            }
        }
    
        return false; // Permitir seleccionar la cuota
    };


    return (
        <>
            {error ? (
                <p>{error}</p>
            ) : cuotas.length === 0 ? (
                <p>No tienes cuotas correspondientes al cuatrimestre actual.</p>
            ) : (
                <>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Cuota</th>
                                <th>Año</th>
                                <th>Importe</th>
                                <th>Primer vencimiento</th>
                                <th>Segundo vencimiento</th>
                                <th>Mora aplicada</th>
                                <th>Total</th>
                                <th>Importe Pagado</th>
                                <th>Estado</th>
                                {(!alumno) && (
                                    <th>Pagar</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {cuotas.map(cuota => {
                                const estado = getEstado(cuota);
                                return (
                                    <tr key={cuota.nroCuota} className={estado === 'Vencida' ? 'table-danger' : estado === 'Pagado' ? 'table-success' : ''}>
                                        <td>{cuota.nroCuota}</td>
                                        <td>{cuota.año}</td>
                                        <td>$ {cuota.importe}</td>
                                        <td>{formatDate(cuota.fechaPrimerVencimiento)}</td>
                                        <td>{formatDate(cuota.fechaSegundoVencimiento)}</td>
                                        <td>$ {(parseFloat(cuota.moraSegundoVencimiento) + parseFloat(cuota.moraPrimerVencimiento)).toFixed(2)}</td>
                                        <td>$ {cuota.total}</td>
                                        <td>$ {cuota.importePagado}</td>
                                        <td>{estado}</td>
                                        {(!alumno) && (
                                            <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    disabled={isCheckboxDisabled(cuota)}
                                                    checked={estado === 'Pagado' || cuotasSeleccionadas.includes(cuota.nroCuota)}
                                                    onChange={() => handleSeleccionCuota(cuota.nroCuota)}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    {cuotasSeleccionadas.length > 0 && (
                        <Button variant="primary" onClick={() => handlePago()}>
                            Informar Pago
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

export default CuotasActuales;