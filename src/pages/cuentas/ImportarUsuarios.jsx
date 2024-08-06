import { useState } from 'react';
import './ImportarUsuarios.css';

import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const ImportarUsuarios = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/importar_usuarios/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${authTokens.access}` // Asegúrate de enviar el token
        },
        body: formData
      });

      if (response.ok) {
        setMessage('Usuarios importados con éxito.');
      } else {
        const errorData = await response.json();
        setMessage(`Error al importar usuarios: ${JSON.stringify(errorData.errors)}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setMessage('Error: No se puede conectar con el servidor. Por favor, intenta más tarde.');
      } else {
        setMessage(`Error: ${error.message}`);
      }
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Importar Usuarios</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="input"
        />
        <button type="submit" className="button">
          Importar
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ImportarUsuarios;