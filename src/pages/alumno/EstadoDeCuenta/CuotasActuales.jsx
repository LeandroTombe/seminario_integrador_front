import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const CuotasActuales = ({ authTokens, alumno }) => {
    const [cuotas, setCuotas] = useState([]);
    const [error, setError] = useState(null);
    const [alumnos, setAlumnos] = useState(null);
    const [cuotasSeleccionadas, setCuotasSeleccionadas] = useState([]);
    const [montoAPagar, setMontoAPagar] = useState('0.00');
    const [montoAPagarMaximo, setMontoAPagarMaximo] = useState('0.00');
    const [valoresExistentes, setValoresExistentes] = useState(null);
    const [showModal, setShowModal] = useState(false);  // Nuevo estado para el modal
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 
    const currentSemester = currentMonth <= 6 ? '1' : '2';
  
    useEffect(() => {
  
      const verificarValores = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/v1/estudiantes/parametrosCompromiso/', {
            params: {
              año: encodeURIComponent(currentYear),  // Codifica el valor del año
              cuatrimestre: currentSemester,
            }
          });
          setValoresExistentes(response.data);  // Si existen, lo estableces
        } catch (error) {
        }
      };
  
      verificarValores();
    }, []);

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

    const tratarfechaForm = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        return `${year}-${month}-${day}`;
    }

    const manejoForm = () => {
        if (!alumno) {
            const fechaHoy = tratarfechaForm();
            const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSd2MWAkLz3BYEFIzFJDy9up1lGKuNACe1oOKLZ4p7Jhs-osVA/viewform?usp=pp_url&entry.1981210019=${alumnos.apellido},+${alumnos.nombre}&entry.246393120=Tecnicatura+Universitaria+en+Programaci%C3%B3n&entry.528240021=${alumnos.dni}&entry.1687154301=${fechaHoy}&entry.2124083799=${mesesSeleccionados}`;
            // const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLScHqqDBeF2j0e9j9ecnv0lWvgKF9-G-V0CHaenG6QXgLI3V2A/viewform?usp=pp_url&entry.551280810=${alumnos.apellido},+${alumnos.nombre}&entry.1533183852=Tecnicatura+Universitaria+en+Programaci%C3%B3n&entry.123577009=${alumnos.dni}&entry.1941417406=${fechaHoy}&entry.964040428=${mesesSeleccionados}`;
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const dia = date.getUTCDate().toString().padStart(2, '0');
        const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const año = date.getUTCFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const handlePago = async () => {
        if (!alumno) {
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

    const meses = [
        "Enero",   // 1
        "Febrero", // 2
        "Marzo",   // 3
        "Abril",   // 4
        "Mayo",    // 5
        "Junio",   // 6
        "Julio",   // 7
        "Agosto",  // 8
        "Septiembre", // 9
        "Octubre", // 10
        "Noviembre", // 11
        "Diciembre"  // 12
    ];
    
    const [mesesSeleccionados, setMesesSeleccionados] = useState('');

    const handleSeleccionCuota = (nroCuota) => {
        setCuotasSeleccionadas((prevSeleccionadas) => {
            const nuevasSeleccionadas = prevSeleccionadas.includes(nroCuota)
                ? prevSeleccionadas.filter(cuota => cuota < nroCuota)
                : [...prevSeleccionadas, nroCuota].sort((a, b) => a - b);
    
            // Calcular el monto total a pagar considerando pagos parciales
            const montoTotal = cuotas
                .filter(cuota => nuevasSeleccionadas.includes(cuota.nroCuota))
                .reduce((total, cuota) => {
                    const montoPendiente = parseFloat(cuota.total) - parseFloat(cuota.importeInformado);
                    return total + Math.max(montoPendiente, 0);
                }, 0);
    
            setMontoAPagar(montoTotal.toFixed(2));
            setMontoAPagarMaximo(montoTotal.toFixed(2))
    
            // Crear un string con los nombres de los meses correspondientes, o "Matricula" si nroCuota es 0
            const mesesString = nuevasSeleccionadas
                .map(cuota => cuota === 0 ? "Matricula" : meses[cuota - 1])
                .join(', ');
    
            setMesesSeleccionados(mesesString);
    
            // Mostrar en la consola las cuotas seleccionadas actualizadas
            //console.log("Cuotas seleccionadas (actualizado):", nuevasSeleccionadas);
    
            return nuevasSeleccionadas;
        });
    };

    const isCheckboxDisabled = (cuota) => {
        // Si la cuota está pagada o tiene el importe igual al total, se deshabilita.
        if (cuota.estado === 'Pagada' || cuota.importeInformado === cuota.total) {
            return true;
        }
    
        // Encontrar la primera cuota pendiente que no esté pagada y cuyo importe sea distinto del total.
        const primeraCuotaPendiente = cuotas.find(
            (c) => c.estado !== 'Pagada' && c.importeInformado !== c.total
        )?.nroCuota || 0;
    
        // Si esta es la primera cuota pendiente, habilitamos el checkbox.
        if (cuota.nroCuota === primeraCuotaPendiente) {
            return false;
        }
    
        // Recorremos las cuotas anteriores a la actual para verificar restricciones.
        for (let i = primeraCuotaPendiente; i < cuota.nroCuota; i++) {
            const cuotaAnterior = cuotas.find(c => c.nroCuota === i);
    
            if (cuotaAnterior) {
                // Si encontramos una cuota con importe igual al total y esta es la inmediata siguiente, habilita.
                if (cuotaAnterior.importeInformado === cuotaAnterior.total && cuota.nroCuota === i + 1) {
                    return false;
                }
    
                // Si una cuota anterior no está pagada ni seleccionada, deshabilita.
                if (!cuotasSeleccionadas.includes(i) && cuotaAnterior.estado !== 'Pagada') {
                    return true;
                }
            }
        }
    
        // En cualquier otro caso, habilita el checkbox.
        return false;
    };

    const handleFirmarCompromiso = () => {
        navigate('/alumno/firmarCompromiso')
      };

      const handleMostrarModal = () => setShowModal(true);  // Mostrar el modal
      const handleCerrarModal = () => setShowModal(false);  // Cerrar el modal
  
      const handleConfirmarPago = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/estudiantes/pagos/informarPagoCuotas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.refresh}`,
                },
                body: JSON.stringify({
                    cuotasSeleccionadas: cuotasSeleccionadas,
                    montoAPagar: montoAPagar,
                }),
            });
            if (!response.ok) {
                throw new Error('Error al confirmar el pago');
            }
    
            const data = await response.json();
            alert('Pago confirmado:', data);
            setShowModal(false);  // Cierra el modal después de confirmar el pago
            window.location.reload();  // Recarga la página después del pago
        } catch (error) {
            alert('Error al confirmar el pago:', error);
        }
    };

    return (
        <>
            {error ? (
                <p>{error}</p>
            ) : cuotas.length === 0 ? (
                <>
                { alumno ? (
                    <p>No hay cuotas correspondientes al cuatrimestre actual</p>
                ) : (
                    <>
                    {valoresExistentes ? (
                        <p>
                        Firma el compromiso de pago pendiente para generar las cuotas del cuatrimestre.
                        <span
                            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }} 
                            onClick={() => handleFirmarCompromiso()}>
                            Firmar Compromiso
                        </span>
                        </p>
                    ) :
                        <p>No es posible generar cuotas, aún no se encuentra disponible el compromiso de pago para este cuatrimestre.</p>
                    }
                    </>
                )
                }
                </>
            ) : (
                <>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Cuota</th>
                                <th>Año</th>
                                <th>Importe</th>
                                <th>Primer Vencimiento</th>
                                <th>Segundo Vencimiento</th>
                                <th>Mora</th>
                                <th>Total</th>
                                <th>Importe Informado</th>
                                <th>Importe Pagado</th>
                                <th>Estado</th>
                                {(!alumno) && (
                                    <th>Pagar</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {cuotas.map(cuota => {
                                const estado = cuota.estado;
                                return (
                                    <tr key={cuota.nroCuota}
                                        className={
                                        estado === 'Vencida'
                                        ? 'table-danger' 
                                        : estado === 'Pagada'
                                        ? 'table-success'
                                        : estado === 'Informada' && tratarfechaForm() > cuota.fechaPrimerVencimiento
                                        ? 'table-danger'
                                        : ''}>
                                        <td>{cuota.nroCuota}</td>
                                        <td>{cuota.año}</td>
                                        <td> {cuota.importe}</td>
                                        <td>{formatDate(cuota.fechaPrimerVencimiento)}</td>
                                        <td>{formatDate(cuota.fechaSegundoVencimiento)}</td>
                                        <td> {(parseFloat(cuota.moraSegundoVencimiento) + parseFloat(cuota.moraPrimerVencimiento)).toFixed(2)}</td>
                                        <td> {cuota.total}</td>
                                        <td> {cuota.importeInformado}</td>
                                        <td> {cuota.importePagado}</td>
                                        <td>{estado}</td>
                                        {(!alumno) && (
                                            <td className="text-center">
                                                <input
                                                    type="checkbox"
                                                    disabled={isCheckboxDisabled(cuota)}
                                                    checked={estado === 'Pagada' || cuotasSeleccionadas.includes(cuota.nroCuota)}
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
                        <Form.Group className="mt-3">
                            <div className="d-flex align-items-center">
                                <Form.Label className="mb-0 me-2">Monto a pagar: </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={montoAPagar}
                                    readOnly
                                    style={{ maxWidth: '150px', backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        // Solo permitir valores que sean menores o iguales al montoAPagar
                                        if (value <= montoAPagarMaximo) {
                                            setMontoAPagar(value);
                                        }
                                    }}
                                />
                                <Button className="ms-2" onClick={() => {setShowModal(true)}}>
                                    Informar Pago
                                </Button>
                            </div>
                        </Form.Group>
                    )}
                </>
            )}
                {/* Modal para confirmar pago */}
            <Modal show={showModal} onHide={handleCerrarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Informar Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>El pago de las cuotas seleccionadas se realiza a través de un formulario externo. Por favor, complete y envíe el formulario para continuar con el proceso de pago.</p>
                    <p>Tenga en cuenta que la confirmación del pago se hará únicamente después de verificar que el pago ha sido efectivamente realizado.</p>
                    <p style={{ textAlign: 'center' }}>
                        <span
                            style={{ 
                                color: 'blue', 
                                textDecoration: 'underline',
                                cursor: 'pointer', 
                                fontSize: '24px', // Tamaño del texto
                                display: 'inline-block', 
                                marginTop: '10px' 
                            }}
                            onClick={() => manejoForm()}
                            //onClick={() => handlePago()}
                        >
                            Formulario de pago
                        </span>
                    </p>
                    <p>Una vez que haya enviado correctamente el formulario, presione en "Confirmar".</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirmarPago}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CuotasActuales;