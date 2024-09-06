// HistorialImportacionesPorFecha.js
import React, { useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable';
import Swal from 'sweetalert2';
import './importaDataComponent.css';

const HistorialImportacionesPorFecha = () => {
    const [fecha, setFecha] = useState('');
    const [historial, setHistorial] = useState(null);
    const [view, setView] = useState(''); // Estado para manejar la vista actual
    const [loading, setLoading] = useState(false);

    const handleFetchDetails = async () => {
        if (!fecha) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, selecciona una fecha.',
            });
            return;
        }

        setLoading(true);

        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/v1/auth/auditoria/detalles/`, {
                params: { fecha }
            });
            setHistorial(res.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.error || 'No se pudo recuperar los detalles de la importación.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="historial-importaciones-fecha">
            <h1>Historial de Importaciones por Fecha</h1>
            <div className="date-selector">
                <label>Selecciona una fecha:</label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
                <button onClick={handleFetchDetails}>Ver Detalles</button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                historial && (
                    <div>
                        <h2>Detalles de la Importación</h2>
                        <div className="details-info">
                            <div className="total-registros">
                                <div className="box">
                                    Total procesados: {historial.total_procesadas}
                                </div>
                                <div className="box">
                                    Filas ignoradas: {historial.cantidad_filas_ignoradas}
                                </div>
                                <div className="box">
                                    Total de registros: {historial.total}
                                </div>
                            </div>
                            <div className="button-group">
                                <button onClick={() => setView('actualizadas')}>
                                    Ver Actualizadas ({historial.cantidad_filas_actualizadas})
                                </button>
                                <button onClick={() => setView('errores')}>
                                    Ver Errores ({historial.cantidad_errores})
                                </button>
                                <button onClick={() => setView('correctas')}>
                                    Ver Correctas ({historial.cantidad_filas_correctas})
                                </button>
                                <button onClick={() => setView('ignoradas')}>
                                    Ver Ignorados ({historial.cantidad_filas_ignoradas})
                                </button>
                            </div>

                            {view === 'actualizadas' && (
                                <div>
                                    <h2>Registros Actualizados</h2>
                                    <DataTable data={historial.actualizadas} columns={[{ Header: 'Mensaje', accessor: 'mensaje' }]} />
                                </div>
                            )}

                            {view === 'errores' && (
                                <div>
                                    <h2>Errores</h2>
                                    <DataTable data={historial.errores} columns={[{ Header: 'Error', accessor: 'error' }]} />
                                </div>
                            )}

                            {view === 'correctas' && (
                                <div>
                                    <h2>Registros Correctos</h2>
                                    <DataTable
                                        data={historial.correctas}
                                        columns={[
                                            { Header: 'Legajo', accessor: 'legajo' },
                                            { Header: 'Apellido', accessor: 'apellido' },
                                            { Header: 'Nombre', accessor: 'nombre' },
                                            { Header: 'Documento', accessor: 'dni' },
                                        ]}
                                    />
                                </div>
                            )}

                            {view === 'ignoradas' && (
                                <div>
                                    <h2>Filas Ignoradas</h2>
                                    <DataTable data={historial.filas_ignoradas} columns={[{ Header: 'Error', accessor: 'error' }]} />
                                </div>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default HistorialImportacionesPorFecha;