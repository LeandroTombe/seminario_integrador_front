import React, { useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable'; // Ajusta la ruta según tu estructura de archivos
import './importaDataComponent.css';

const ImportDataComponent = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [view, setView] = useState(''); // Controla qué sección mostrar

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Por favor, selecciona un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/auth/importar_usuarios/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(res.data);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Importar Datos</h1>
            </div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir</button>

            {response && (
                <div>
                    <div className="button-group">
                        <button onClick={() => setView('actualizadas')}>Ver Actualizadas ({response.cantidad_filas_actualizadas})</button>
                        <button onClick={() => setView('errores')}>Ver Errores ({response.cantidad_errores})</button>
                        <button onClick={() => setView('correctas')}>Ver Correctas ({response.cantidad_filas_correctas})</button>
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
                                    { Header: 'Nombre', accessor: 'nombre' },
                                    { Header: 'Apellido', accessor: 'apellido' },
                                ]}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImportDataComponent;