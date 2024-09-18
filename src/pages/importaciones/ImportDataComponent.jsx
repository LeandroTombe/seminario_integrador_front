import React, { useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable'; 
import Swal from 'sweetalert2';
import './importaDataComponent.css';
import Layout from '../../Layout'

const ImportDataComponent = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [view, setView] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, selecciona un archivo.',
            });
            return;
        }
    
        // Mostrar el SweetAlert de carga
        Swal.fire({
            title: 'Subiendo archivo...',
            text: 'Por favor, espera mientras se carga el archivo.',
            icon: 'info',
            allowOutsideClick: false,
            timerProgressBar: true,
            timer: 30000,  // Temporizador de 3 segundos
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/importar_usuarios/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(res.data);
    
            Swal.fire({
                icon: 'success',
                text: 'El archivo se ha procesado y subido correctamente.',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 3000,  // Temporizador de 3 segundos
            });
        } catch (error) {
            console.log(error.response.data),
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.error || 'Ocurrió un error al subir el archivo.',
            });
        }
    };
    return (
        <Layout>
            <h1>Importar Alumnos</h1>
            <div className="container-import">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Subir archivo</button>
    
                {response && (
                    <div>
                        <div className="button-group">
                            <button onClick={() => setView('actualizadas')}>
                                Ver Actualizadas ({response.cantidad_filas_actualizadas})
                            </button>
                            <button onClick={() => setView('errores')}>
                                Ver Errores ({response.cantidad_errores})
                            </button>
                            <button onClick={() => setView('correctas')}>
                                Ver Correctas ({response.cantidad_filas_correctas})
                            </button>
                            <button onClick={() => setView('ignoradas')}>
                                Ver Ignorados ({response.cantidad_filas_ignoradas})
                            </button>
                        </div>
    
                        {view === 'actualizadas' && (
                            <div>
                                <h2>Registros Actualizados</h2>
                                <DataTable data={response.actualizadas} columns={[{ Header: 'Mensaje', accessor: 'mensaje' }]} />
                            </div>
                        )}
    
                        {view === 'errores' && (
                            <div>
                                <h2>Errores</h2>
                                <DataTable data={response.errores} columns={[{ Header: 'Error', accessor: 'error' }]} />
                            </div>
                        )}
    
                        {view === 'correctas' && (
                            <div>
                                <h2>Registros Correctos</h2>
                                <DataTable
                                    data={response.correctas}
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
                                <DataTable data={response.filas_ignoradas} columns={[{ Header: 'Error', accessor: 'error' }]} />
                            </div>
                        )}
    
                        <div className="total-registros">
                            <div className="box">
                                Total procesados: {response.total_procesadas}
                            </div>
                            <div className="box">
                                Filas ignoradas: {response.cantidad_filas_ignoradas}
                            </div>
                            <div className="box">
                                Total de registros: {response.total}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ImportDataComponent;