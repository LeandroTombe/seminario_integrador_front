// ImportarUsuariosForm.js
import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { Button, Grid, TextField, Typography } from '@mui/material';
import AuthContext from '../../context/AuthContext';

const ImportarUsuariosForm = ({ onImport }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    Swal.fire({
      title: 'Cargando',
      text: 'Subiendo 1 de 1 archivos...',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/importar_usuarios/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authTokens.access}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        onImport(data); // Llamar a la función de callback con los datos
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
        setMessage('');
        onImport(errorData); // Llamar a la función de callback con los datos de error
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
      setLoading(false);
      Swal.close();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center" marginTop={2}>
        <Grid item xs={12}>
          <TextField
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" disabled={loading} fullWidth>
            {loading ? 'Cargando...' : 'Importar'}
          </Button>
        </Grid>
      </Grid>
      {message && (
        <Typography color="error" marginTop={2}>
          {message}
        </Typography>
      )}
    </form>
  );
};

export default ImportarUsuariosForm;