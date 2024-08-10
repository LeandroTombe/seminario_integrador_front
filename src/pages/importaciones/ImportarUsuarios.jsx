import { useState, useContext } from 'react';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import './ImportarUsuarios.css';
import AuthContext from '../../context/AuthContext';

const ImportarUsuarios = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [successfulImports, setSuccessfulImports] = useState(0);
  const [failedImports, setFailedImports] = useState(0);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const { authTokens } = useContext(AuthContext);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    setLoading(true); // Iniciar carga
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    // Mostrar alerta de carga con SweetAlert2
    Swal.fire({
      title: 'Cargando',
      text: 'Subiendo 1 de 1 archivos...',
      didOpen: () => {
        Swal.showLoading(); // Mostrar el indicador de carga
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/importar_usuarios/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authTokens.access}` // Asegúrate de enviar el token
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setTotalRows(data.total_rows);
        setSuccessfulImports(data.successful_imports);
        setFailedImports(data.failed_imports);
        setErrors(data.errors || []);
        setMessage('Importación completada exitosamente.');
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Importación completada exitosamente.'
        });
      } else if (response.status === 401) { 
        setMessage('Error: No tiene los permisos necesarios para realizar esta acción.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No tiene los permisos necesarios para realizar esta acción.'
        });
      } else {
        const errorData = await response.json();
        setTotalRows(errorData.total_rows);
        setSuccessfulImports(errorData.successful_imports);
        setFailedImports(errorData.failed_imports);
        setErrors(errorData.errors || []);
        setMessage('Se encontraron algunos errores durante la importación.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Se encontraron algunos errores durante la importación.'
        });
      }

    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('Error: No se puede conectar con el servidor. Por favor, intenta más tarde.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se puede conectar con el servidor. Por favor, intenta más tarde.'
        });
      } else {
        setMessage(`Error: ${error.message}`);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        });
      }
      console.error(error);
    } finally {
      setLoading(false); // Finalizar carga
      Swal.close(); // Cerrar la alerta de carga
    }
  };

  return (
    <div className="container-import">
      <h3 className="heading-import">Importar Usuarios</h3>
      <form onSubmit={handleSubmit} className="form-import">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="input-import"
        />
        <button type="submit" className="button-import" disabled={loading}>
          {loading ? 'Cargando...' : 'Importar'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      {loading && <p className="loading-message">Por favor, espera mientras se importa el archivo...</p>}
      <div className="import-stats">
        <p className="total">Total: {totalRows}</p>
        <p className="validos">Válidos: {successfulImports}</p>
        <p className="invalidos">Inválidos: {failedImports}</p>
      </div>
      {errors.length > 0 && (
        <div className="import-errors">
          <p>Errores:</p>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


export default ImportarUsuarios;